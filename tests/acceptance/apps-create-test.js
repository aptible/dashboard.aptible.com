import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

var App, server;

module('Acceptance: /stacks/:stack_id/apps/new', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    if (server) {
      server.shutdown();
    }
  }
});

test('visit /stacks/1/apps/new', function(){
  expect(2);

  stubApps();

  stubRequest('get', '/accounts/1', function(request){
    var json = JSON.parse(request.requestBody);

    return this.success({
      id: '1'
    });
  });

  signInAndVisit('/stacks/1/apps/new');

  andThen(function(){
    equal(currentPath(), 'stack.new-app');

    var input = findWithAssert('input.app-handle');
    ok(input.length, 'has app handle input');
  });
});

test('visit /stacks/1/apps/new and create an app', function(){
  expect(3);

  stubApps();

  stubRequest('get', '/accounts/1', function(request){
    var json = JSON.parse(request.requestBody);

    return this.success({
      id: '1'
    });
  });

  stubRequest('post', '/accounts/1/apps', function(request){
    var json = JSON.parse(request.requestBody);
    equal(json.handle, 'my-new-app', 'posts app handle');

    return this.success(201, {
      id: 'my-new-app-id',
      handle: 'my-new-app'
    });
  });

  signInAndVisit('/stacks/1/apps/new');
  fillIn('input.app-handle', 'my-new-app');
  click(':contains(Create app)');

  andThen(function(){
    equal(currentPath(), 'apps.index');

    var appEl = findWithAssert(':contains(my-new-app)');
    ok( appEl.length, 'shows my new app');
  });
});
