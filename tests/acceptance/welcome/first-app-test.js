import Ember from 'ember';
import startApp from '../../helpers/start-app';

import { read, write, remove } from '../../../utils/storage';
import { firstAppKey } from  '../../../welcome/first-app/route';

var application;

module('Acceptance: WelcomeFirstApp', {
  setup: function() {
    remove(firstAppKey);
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
    remove(firstAppKey);
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

  signInAndVisit('/welcome/first-app');

  fillIn('input[name="app-handle"]', appHandle);
  click('button:contains(Proceed to Subscription Info)');
  andThen(function() {
    var stored = read(firstAppKey);
    equal(stored.appHandle, appHandle, 'app handle is saved in localStorage');
    equal(currentPath(), 'welcome.payment-info', 'redirected to payment info');
  });
});
