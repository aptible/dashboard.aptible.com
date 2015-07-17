import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;
let url = '/stacks/my-stack-1/apps/new';
let appIndexUrl = '/stacks/my-stack-1/apps';
let stackId = 'my-stack-1';
let stackHandle = 'my-stack-1';

module('Acceptance: App Create', {
  beforeEach: function() {
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
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

function findApp(appHandle){
  return find(`:contains(${appHandle})`);
}

test(`${url} requires authentication`, function(assert) {
  expectRequiresAuthentication(url);
});

test(`visiting /stacks/:stack_id/apps without any apps redirects to ${url}`, function(assert) {
  stubStack({ id: stackId , apps: [] });
  stubRequest('get', '/accounts/my-stack-1/apps', function(request){
    return this.success({
      _links: {},
      _embedded: {
        apps: []
      }
    });
  });
  stubOrganization();
  stubOrganizations();
  signInAndVisit(`/stacks/${stackId}/apps`);

  andThen(function() {
    assert.equal(currentPath(), 'dashboard.stack.apps.new');
  });
});

test(`visit ${url} shows basic info`, function(assert) {
  assert.expect(6);
  stubOrganization();
  stubOrganizations();
  signInAndVisit(url);
  andThen(function(){
    assert.equal(currentPath(), 'dashboard.stack.apps.new');
    expectInput('handle');
    expectButton('Save App');
    expectButton('Cancel');
    expectTitle(`Create an App - ${stackHandle}`);
    expectFocusedInput('handle');
  });
});

test(`visit ${url} and cancel`, function(assert) {
  stubOrganization();
  stubOrganizations();
  let appHandle = 'abc-my-app-handle';
  signInAndVisit(url);

  andThen(function(){
    fillInput('handle', appHandle);
    clickButton('Cancel');
  });

  andThen(function(){
    assert.equal(currentPath(), 'dashboard.stack.apps.index');

    assert.ok( !findApp(appHandle).length,
        'does not show app');
  });
});

test(`visit ${url} without apps show no cancel button`, function(assert) {
  stubRequest('get', '/accounts/my-stack-1/apps', function(request){
    return this.success({
      _links: {},
      _embedded: {
        apps: []
      }
    });
  });
  stubOrganization();
  stubOrganizations();
  stubStack({id: stackId}); // stubs a stack with no apps
  signInAndVisit(url);

  andThen(function(){
    assert.equal(currentPath(), 'dashboard.stack.apps.new');
    let button = findButton('Cancel');
    assert.ok(!button.length, 'Cancel button is not present');
  });
});

test(`visit ${url} and transition away`, function(assert) {
  stubOrganization();
  stubOrganizations();
  let appHandle = 'abc-my-app-handle';
  signInAndVisit(url);

  andThen(function(){
    fillInput('handle', appHandle);
    visit( appIndexUrl );
  });

  andThen(function(){
    assert.equal(currentPath(), 'dashboard.stack.apps.index');

    assert.ok( !findApp(appHandle).length,
        'does not show app');
  });
});

test(`visit ${url} and create an app`, function(assert) {
  stubOrganization();
  stubOrganizations();
  assert.expect(3);
  let appHandle = 'abc-my-app-handle';

  stubRequest('post', '/accounts/my-stack-1/apps', function(request){
    var json = this.json(request);
    assert.equal(json.handle, appHandle, 'posts app handle');

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
  fillInput('handle', appHandle);
  clickButton('Save App');
  andThen(function(){
    assert.equal(currentPath(), 'dashboard.app.deploy');

    assert.ok( findApp(appHandle).length > 0,
        'lists new app on index' );
  });
});

test(`visit ${url} when user is not verified shows "Cannot create" message`, function(assert) {
  let userData = {verified: false};
  stubOrganization();
  stubOrganizations();
  signInAndVisit(url, userData);
  andThen( () => {
    expectNoButton('Save App');
    expectNoButton('Cancel');
    let message = find('.activate-notice h1');
    assert.ok(message.text().indexOf('Cannot create a new app') > -1,
       'shows cannot create app message');
  });
});
