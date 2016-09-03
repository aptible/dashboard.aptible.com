import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../../helpers/start-app';

let application;

// FIXME this is hardcoded to match the value for signIn in
// aptible-helpers
const organizationId = 1;

const billingUrl = `/organizations/${organizationId}/admin/billing`;
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
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test(`visiting ${url} requires authentication`, () => {
  stubOrganization();
  stubStacks();
  expectRequiresAuthentication(url);
});

test(`visiting ${aptibleSettingsUrl} shows link to billing`, () => {
  stubOrganization();
  stubStacks();
  signInAndVisit(aptibleSettingsUrl);
  andThen(() => {
    expectLink(billingUrl);
  });
});

test(`visiting ${url} shows "Plan" tab`, (assert) => {
  stubOrganization();
  stubStacks();
  signInAndVisit(url);
  andThen(() => {
    expectNav(assert, 'Plan');
    expectLink(planUrl);
  });
});

test(`visiting ${url} shows "Payment Method" tab`, (assert) => {
  stubOrganization();
  stubStacks();
  signInAndVisit(url);
  andThen(() => {
    expectNav(assert, 'Payment Method');
    expectLink(paymentMethodUrl);
  });
});

test(`visiting ${billingUrl} displays "Billing" header`, (assert) => {
  let billingDetailData = {
    id: organizationId,
    plan: 'production',
    payment_method_name: 'VISA',
    payment_method_display: '4242',
    next_invoice_date: '2015-06-29T11:06:48.000-04:00',
    _links: { organization: { href: `/organizations/${organizationId}` } }
  };

  stubOrganization({ id: organizationId}, billingDetailData);
  stubStacks();

  signInAndVisit(url);
  andThen(() => {
    let billingHeader = findWithAssert('.resource-header h1:contains(Billing)').
      parents('.resource-header');
    assert.ok(billingHeader.text().match('VISA'), 'shows credit card brand');
    assert.ok(billingHeader.text().match('4242'), 'shows credit card last 4');
    assert.ok(billingHeader.text().match('June 29, 2015'), 'shows next invoice date');
  });
});
