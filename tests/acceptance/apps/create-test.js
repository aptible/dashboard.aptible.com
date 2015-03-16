import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;
let url = '/stacks/my-stack-1/apps/new';
let appIndexUrl = '/stacks/my-stack-1/apps';
let stackId = 'my-stack-1';
let stackHandle = 'my-stack-handle';

module('Acceptance: App Create', {
  setup: function() {
    App = startApp();
    stubStacks({ includeApps: true });
    stubStack({
      id: stackId,
      handle: stackHandle,
      _links: {
        apps: { href: `/accounts/${stackId}/apps` },
        organization: { href: '/organizations/1' }
      }
    });
    stubOrganization();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

function findApp(appHandle){
  return find(`:contains(${appHandle})`);
}

test(`${url} requires authentication`, function(){
  expectRequiresAuthentication(url);
});

test(`visiting /stacks/:stack_id/apps without any apps redirects to ${url}`, function() {
  stubStack({ id: stackId });
  stubOrganization();
  signInAndVisit(`/stacks/${stackId}/apps`);

  andThen(function() {
    equal(currentPath(), 'stack.apps.new');
  });
});

test(`visit ${url} shows basic info`, function(){
  expect(6);

  signInAndVisit(url);
  andThen(function(){
    equal(currentPath(), 'stack.apps.new');
    expectInput('handle');
    expectButton('Save App');
    expectButton('Cancel');
    titleUpdatedTo(`Create an App - ${stackHandle}`);
    expectFocusedInput('handle');
  });
});

test(`visit ${url} and cancel`, function(){
  let appHandle = 'abc-my-app-handle';
  signInAndVisit(url);

  andThen(function(){
    fillInput('handle', appHandle);
    clickButton('Cancel');
  });

  andThen(function(){
    equal(currentPath(), 'stack.apps.index');

    ok( !findApp(appHandle).length,
        'does not show app');
  });
});

test(`visit ${url} without apps show no cancel button`, function(){
  stubStack({id: stackId}); // stubs a stack with no apps
  signInAndVisit(url);

  andThen(function(){
    equal(currentPath(), 'stack.apps.new');
    let button = findButton('Cancel');
    ok(!button.length, 'Cancel button is not present');
  });
});

test(`visit ${url} and transition away`, function(){
  let appHandle = 'abc-my-app-handle';
  signInAndVisit(url);

  andThen(function(){
    fillInput('handle', appHandle);
    visit( appIndexUrl );
  });

  andThen(function(){
    equal(currentPath(), 'stack.apps.index');

    ok( !findApp(appHandle).length,
        'does not show app');
  });
});

test(`visit ${url} and create an app`, function(){
  expect(3);
  let appHandle = 'abc-my-app-handle';

  stubRequest('post', '/accounts/my-stack-1/apps', function(request){
    var json = this.json(request);
    equal(json.handle, appHandle, 'posts app handle');

    return this.success(201, {
      id: 'my-new-app-id',
      handle: appHandle
    });
  });

  // Stub for app deploy
  stubRequest('get', '/users/:user_id/ssh_keys', function(request){
    return this.success({ _embedded: { ssh_keys: [] } });
  });

  signInAndVisit(url);
  andThen(function(){
    fillInput('handle', appHandle);
    clickButton('Save App');
  });
  andThen(function(){
    equal(currentPath(), 'app.deploy');

    ok( findApp(appHandle).length > 0,
        'lists new app on index' );
  });
});

test(`visit ${url} when user is not verified shows "Cannot create" message`, function(){
  let userData = {verified: false};
  signInAndVisit(url, userData);
  andThen( () => {
    expectNoButton('Save App');
    expectNoButton('Cancel');
    let message = find('.panel-heading h3');
    ok(message.text().indexOf('Cannot create a new app') > -1,
       'shows cannot create app message');
  });
});
