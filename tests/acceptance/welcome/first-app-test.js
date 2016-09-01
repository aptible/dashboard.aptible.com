import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';
var application;

let claimUrls = ['/claims/user', '/claims/account', '/claims/app', '/claims/database'];

module('Acceptance: WelcomeFirstApp', {
  beforeEach: function() {
    application = startApp();
    claimUrls.forEach((claimUrl) => {
      stubRequest('post', claimUrl, function() {
        return [204, {}, ''];
      });
    });
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /welcome/first-app when not logged in', function(assert) {
  visit('/welcome/1/first-app');

  andThen(function() {
    assert.equal(currentPath(), 'login');
  });
});

test('visiting /welcome/1/first-app logged in with no billing detail', function(assert) {
  stubStacks();
  stubDatabaseImages();
  stubRequest('get', '/billing_details/1', (request) => request.notFound());
  stubOrganization();
  stubRequest('get', '/billing_details/1', (request) => request.notFound());
  signInAndVisit('/welcome/1/first-app');

  andThen(function() {
    assert.equal(currentPath(), 'welcome.first-app', 'remain on welcome page');
  });
});

test('visiting /welcome/1/first-app logged in with billing detail and stacks redirects to stacks', function(assert) {
  stubStacks();
  stubDatabaseImages();
  stubBillingDetail({ id: 1 });
  stubOrganization();
  signInAndVisit('/welcome/1/first-app');

  andThen(function() {
    assert.equal(currentPath(), 'enclave.stack.apps.index', 'remain on welcome page');
  });
});

test('submitting a first app directs to payment info', function(assert) {
  var appHandle = 'my-app';

  stubRequest('get', '/billing_details/1', (request) => request.notFound());
  stubStacks({}, []);
  stubDatabaseImages();
  stubOrganization();

  signInAndVisit('/welcome/1/first-app');

  fillIn('input[name="app-handle"]', appHandle);

  click('button:contains(Get Started)');
  andThen(function() {
    assert.equal(currentPath(), 'welcome.payment-info', 'redirected to payment info');
  });
});

test('choosing a database type opens database pane, clicking it again closes', function(assert) {
  stubStacks({}, []);
  stubDatabaseImages();
  stubOrganization();

  signInAndVisit('/welcome/1/first-app');

  click('.select-option[title="Redis"]');
  andThen(() => {
    assert.ok(find('input[name="db-handle"]').length === 1, 'db handle input on the page');
    assert.ok(find('select[name="databaseImage"]').length === 1, 'db version input on the page');
  });
  click('.select-option[title="Redis"]');
  andThen(() => {
    assert.ok(find('input[name="db-handle"]').length === 0, 'db handle input not on the page');
    assert.ok(find('select[name="databaseImage"]').length === 0, 'db version input not on the page');
  });
});
