import Ember from 'ember';
import startApp from '../../helpers/start-app';

var application;

module('Acceptance: WelcomeFirstApp', {
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /welcome/first-app when not logged in', function() {
  visit('/welcome/first-app');

  andThen(function() {
    equal(currentPath(), 'login');
  });
});

test('submitting a first app directs to subscriptions', function() {
  var appHandle = 'my-app';

  stubOrganizations();
  signInAndVisit('/welcome/first-app');

  fillIn('input[name="app-handle"]', appHandle);
  click('button:contains(Get Started)');
  andThen(function() {
    equal(currentPath(), 'welcome.payment-info', 'redirected to payment info');
  });
});
