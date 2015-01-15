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

test('visiting /stacks/1/apps requires authentication', function() {
  expectRequiresAuthentication('/stacks/1/apps');
});

test('visiting /stacks/1/apps', function() {
  signInAndVisit('/stacks/1/apps');

  andThen(function() {
    equal(currentPath(), 'stacks.stack.apps.index');
  });
});

test('visiting /stacks/1/apps shows list of apps', function() {
  signInAndVisit('/stacks/1/apps');

  andThen(function() {
    var appRows = find('.panel.app');

    equal(appRows.length, 2, '2 apps');
  });
});

test('visiting /stacks/1/apps then clicking on an app visits the app', function() {
  signInAndVisit('/stacks/1/apps');

  andThen(function(){
    var appLink = find('a[href~="/apps/1"]');
    ok(appLink.length, 'has link to app 1');

    click(appLink);
  });

  andThen(function(){
    equal(currentPath(), 'app.services', 'app show page is visited');
  });
});
