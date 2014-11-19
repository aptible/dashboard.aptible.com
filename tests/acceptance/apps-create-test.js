import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

var App, server;

module('Acceptance: apps/new', {
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

test('visit /apps/new and create an app', function(){
  expect(4);

  stubApps();

  signInAndVisit('/apps/new');

  stubRequest('post', '/accounts/1/apps', function(request){
    var json = JSON.parse(request.requestBody);
    equal(json.handle, 'my-new-app', 'posts app handle');

    return [200, {}, {
      id: 'my-new-app-id',
      handle: 'my-new-app'
    }];
  });

  andThen(function(){
    equal(currentPath(), 'apps.new');

    fillIn('input.app-name', 'my-new-app');
    click(':contains(Create app)');
  });

  andThen(function(){
    equal(currentPath(), 'apps.index');

    var appEl = findWithAssert(':contains(my-new-app)');
    ok( appEl.length, 'shows my new app');
  });
});
