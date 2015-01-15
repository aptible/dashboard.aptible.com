import Ember from 'ember';
import startApp from '../helpers/start-app';

var App;

module('Acceptance: LandingPage', {
  setup: function() {
    App = startApp();
    stubStacks();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting / redirects to login page', function() {
  visit('/');

  andThen(function() {
    equal(currentPath(), 'login');
  });
});

test('visiting / when logged in redirects to first stack page', function() {
  signInAndVisit('/');

  andThen(function() {
    equal(currentPath(), 'stacks.stack.apps.index');
  });
});
