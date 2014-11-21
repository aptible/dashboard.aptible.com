import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

var App, server;

module('Acceptance: Apps', {
  setup: function() {
    App = startApp();
    stubStacks({includeApps:true});
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
  signInAndVisit('/apps');

  andThen(function() {
    equal(currentPath(), 'apps.index');
  });
});

test('visiting /apps shows list of stacks', function() {
  signInAndVisit('/apps');

  andThen(function() {
    App.testHelpers.expectStackHeader('my-stack-1');
    App.testHelpers.expectStackHeader('my-stack-2');
  });
});

test('visiting /apps shows apps in stacks', function() {
  signInAndVisit('/apps');

  andThen(function() {
    var stackPanels = find('.account-panel');

    equal(stackPanels.length, 2, '2 stack panels');

    for (var i=0; i < stackPanels.length; i++) {
      var panel = stackPanels[i];

      var appRows = find('.app-row', panel);
      equal(appRows.length, '2', '2 app rows');
    }
  });
});

test('visiting /apps then clicking on an app visits the app', function() {
  signInAndVisit('/apps');
  click('.app-link');
  andThen(function(){
    equal(currentPath(), 'apps.show', 'show page is visited');
  });
});
