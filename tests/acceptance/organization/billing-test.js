import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';

let application;

// FIXME this is hardcoded to match the value for signIn in
// aptible-helpers
const organizationId = 'o1';

const billingUrl = `/organizations/${organizationId}/billing`;
const url = billingUrl;
const aptibleSettingsUrl = `/organizations/${organizationId}`;
const planUrl = `${billingUrl}/plan`;
const paymentMethodUrl = `${billingUrl}/payment-method`;

function expectNav(assert, tabName) {
  const tab = find(`.nav li:contains(${tabName})`);
  assert.ok(tab.length, `Finds nav containing "${tabName}"`);
}

module('Acceptance: Organizations: Billing', {
  beforeEach: function() {
    application = startApp();
    stubOrganization();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test(`visiting ${url} requires authentication`, () => {
  expectRequiresAuthentication(url);
});

test(`visiting ${aptibleSettingsUrl} shows link to billing`, () => {
  signInAndVisit(aptibleSettingsUrl);
  andThen(() => {
    expectLink(billingUrl);
  });
});

test(`visiting ${billingUrl} redirects to /plan`, (assert) => {
  signInAndVisit(billingUrl);
  andThen(() => {
    assert.equal(currentPath(), 'dashboard.organization.billing.plan');
    expectLink(billingUrl);
  });
});

test(`visiting ${url} shows "Plan" tab`, (assert) => {
  signInAndVisit(url);
  andThen(() => {
    expectNav(assert, 'Plan');
    expectLink(planUrl);
  });
});

test(`visiting ${url} shows "Payment Method" tab`, (assert) => {
  signInAndVisit(url);
  andThen(() => {
    expectNav(assert, 'Payment Method');
    expectLink(paymentMethodUrl);
  });
});
