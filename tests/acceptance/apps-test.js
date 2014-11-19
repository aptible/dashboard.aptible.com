import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

var App, server;

module('Acceptance: Apps', {
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

test('visiting /apps when not signed in', function() {
  visit('/apps');

  andThen(function() {
    equal(currentPath(), 'login');
  });
});

test('visiting /apps', function() {
  stubApps();
  signInAndVisit('/apps');

  andThen(function() {
    equal(currentPath(), 'apps.index');
  });
});

test('visiting /apps shows list of apps', function() {
  stubApps(this);
  signInAndVisit('/apps');

  andThen(function() {
    var row = findWithAssert('.app-row');
    equal(row.length, 2, 'shows 2 apps');
  });
});

test('visiting /apps then clicking on an app visits the app', function() {
  stubApps(this);
  signInAndVisit('/apps');
  click('.app-link');
  andThen(function(){
    equal(currentPath(), 'apps.show', 'show page is visited');
  });
});

test('visiting /apps/my-app shows the app', function() {
  stubApps(this);
  signInAndVisit('/apps/my-app');
  andThen(function() {
    equal(currentPath(), 'apps.show', 'show page is visited');
    var contentNode = findWithAssert('*:contains(my-app)');
    ok(contentNode.length > 0, 'my-app is on the page');
  });
});
