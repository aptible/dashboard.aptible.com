import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;
let url = '/stacks/1/apps/new';
let appIndexUrl = '/stacks/1/apps';
let stackId = 1;

module('Acceptance: App Create', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

function findApp(appHandle){
  return find(`.app-handle:contains(${appHandle})`);
}

test(`${url} requires authentication`, function(){
  expectRequiresAuthentication(url);
});

test(`visit ${url}`, function(){
  expect(3);
  let stackHandle = 'my-new-stack';
  stubStack({id:stackId, handle: stackHandle});

  signInAndVisit(url);
  andThen(function(){
    equal(currentPath(), 'stack.apps.new');
    expectInput('handle');
    titleUpdatedTo(`Create an App - ${stackHandle}`);
  });
});

test(`visit ${url} and cancel`, function(){
  let appHandle = 'abc-my-app-handle';
  stubStacks();
  stubOrganization();
  stubStack({id: stackId});

  signInAndVisit(url);
  andThen(function(){
    fillIn( findInput('handle'), appHandle);
    click( findButton('Cancel') );
  });

  andThen(function(){
    equal(currentPath(), 'stack.apps.index');

    ok( !findApp(appHandle).length,
        'does not show app');
  });
});

test(`visit ${url} and transition away`, function(){
  let appHandle = 'abc-my-app-handle';
  stubStacks();
  stubStack({id: 1});

  signInAndVisit(url);
  andThen(function(){
    fillIn( findInput('handle'), appHandle);
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

  stubRequest('get', '/accounts/1', function(request){
    var json = JSON.parse(request.requestBody);

    return this.success({
      id: '1',
      handle: 'stack-1'
    });
  });

  stubRequest('get', '/accounts', function(request){
    return this.success({
      _embedded: {
        accounts: [{
          id: '1',
          handle: 'stack-1',
          _links: { apps: { href: '/accounts/1/apps' } }
        }]
      }
    });
  });

  stubRequest('get', '/accounts/1/apps', function(request){
    return this.success({
      _embedded: { apps: [] }
    });
  });

  stubRequest('post', '/accounts/1/apps', function(request){
    var json = JSON.parse(request.requestBody);
    equal(json.handle, appHandle, 'posts app handle');

    return this.success(201, {
      id: 'my-new-app-id',
      handle: appHandle
    });
  });

  signInAndVisit(url);
  andThen(function(){
    fillIn( findInput('handle'), appHandle);
    click( findButton('Save App') );
  });
  andThen(function(){
    equal(currentPath(), 'stack.apps.index');

    ok( findApp(appHandle).length === 1,
        'lists new app on index' );
  });
});
