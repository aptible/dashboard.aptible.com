import Ember from 'ember';
import startApp from '../helpers/start-app';

var App;

module('Acceptance: LandingPage', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting / redirects to login page', function() {
  stubStacks();
  visit('/');

  andThen(function() {
    equal(currentPath(), 'login');
  });
});


test('visiting / when logged in with more than one stacks redirects to stacks index page', function() {
  stubStacks();
  signInAndVisit('/');

  andThen(function() {
    equal(currentPath(), 'stacks.index');
  });
});

test('visiting / when logged in with only one stack redirects to first stack page', function() {
  let stackId = '1';
  stubStacks();
  signInAndVisit('/');

  andThen(function() {
    equal(currentURL(), `/stacks/${stackId}/apps`);
    equal(currentPath(), 'stack.apps.index');

    ok( find(`a[href*="stacks/${stackId}/databases"]`).length,
        'has link to databases');
    ok( find(`a[href*="stacks/${stackId}/logging"]`).length,
        'has link to databases');
  });
});