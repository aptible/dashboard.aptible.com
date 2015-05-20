import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';
var application;

let claimUrls = ['/claims/user', '/claims/account', '/claims/app', '/claims/database'];

module('Acceptance: WelcomeFirstApp', {
  setup: function() {
    application = startApp();
    claimUrls.forEach((claimUrl) => {
      stubRequest('post', claimUrl, function(request) {
        return [204, {}, ''];
      });
    });
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

test('visiting /welcome/first-app logged in with stacks', function() {
  stubStacks();
  stubOrganizations();
  stubOrganization();
  signInAndVisit('/welcome/first-app');

  andThen(function() {
    equal(currentPath(), 'stack.apps.index');
  });
});

test('submitting a first app directs to payment info', function() {
  var appHandle = 'my-app';

  stubStacks({}, []);
  stubOrganizations();
  signInAndVisit('/welcome/first-app');

  fillIn('input[name="app-handle"]', appHandle);
  click('button:contains(Get Started)');
  andThen(function() {
    equal(currentPath(), 'welcome.payment-info', 'redirected to payment info');
  });
});

test('submitting a first app directs to payment info', function() {
  var appHandle = 'my-app';

  stubStacks({}, []);
  stubOrganizations();
  signInAndVisit('/welcome/first-app');

  fillIn('input[name="app-handle"]', appHandle);
  click('button:contains(Get Started)');
  andThen(function() {
    equal(currentPath(), 'welcome.payment-info', 'redirected to payment info');
  });
});

test('choosing a database type opens database pane, clicking it again closes', function(assert) {
  var appHandle = 'my-app';

  stubStacks({}, []);
  stubOrganizations();
  signInAndVisit('/welcome/first-app');

  click('.select-option[title="Redis"]');
  andThen(() => {
    assert.ok(find('input[name="db-handle"]').length === 1, 'db handle input on the page');
  });
  click('.select-option[title="Redis"]');
  andThen(() => {
    assert.ok(find('input[name="db-handle"]').length === 0, 'db handle input not on the page');
  });
});
