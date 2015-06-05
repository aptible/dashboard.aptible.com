import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { didTrackEventWith } from 'diesel/tests/helpers/mock-analytics';
import { UPGRADE_PLAN_REQUEST_EVENT } from 'diesel/models/organization';
import { mockStripe } from '../../../helpers/mock-stripe';

let application;

// FIXME this is hardcoded to match the value for signIn in
// aptible-helpers
const organizationId = 'o1';

const paymentMethodUrl = `/organizations/${organizationId}/billing/payment-method`;
const url = paymentMethodUrl;
const apiOrganizationUrl = `/organizations/${organizationId}`;

const updatePaymentMethodButton = "Update Payment Method";

module('Acceptance: Organizations: Billing: Payment Method', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test(`visiting ${url} requires authentication`, () => {
  stubOrganization();
  expectRequiresAuthentication(url);
});

test(`shows Update Payment Method button`, () => {
  stubOrganization();
  signInAndVisit(url);
  andThen(() => {
    expectButton(updatePaymentMethodButton);
  });
});

test(`shows current payment method`, (assert) => {
  const billingDetailUrl = `/organizations/${organizationId}/billing_detail`;

  const name = 'VISA',
    display = '4242',
    invoiceDate = '2015-06-29T11:06:48.000-04:00',
    expiresAt = '06/15';

  stubOrganization({
    _links: { billing_detail: { href: billingDetailUrl } }
  });

  stubRequest('get', billingDetailUrl, (request) => {
    request.ok({
      id: 'b-d-id',
      payment_method_name: name,
      payment_method_display: display,
      next_invoice_date: invoiceDate
    });
  });

  signInAndVisit(url);
  andThen(() => {
    assert.ok(find(`.billing-payment-method:contains(${name})`).length,
              `has payment name "${name}"`);
    assert.ok(find(`.billing-payment-method:contains(${display})`).length,
              `has payment display "${display}"`);
    /* FIXME auth does not report expiry yet
    assert.ok(find(`.billing-payment-method:contains(${expiresAt})`).length,
              `has payment expires at "${expiresAt}"`);
     */
  });
});

test(`shows credit card form after clicking "Update Payment Method"`, (assert) => {
  stubOrganization();
  signInAndVisit(url);
  clickButton(updatePaymentMethodButton);
  andThen(() => {
    assert.ok(find('form.stripe-cc-form').length,
              'displays stripe cc form');
  });
});

test(`updates credit card form after clicking "Update Payment Method"`, (assert) => {
  assert.expect(2);
  const cardNumber = '4242424242424242',
        cardCvc = '123',
        cardExpMonth = '5',
        cardExpYear = '2017',
        cardZip = '11211',
        stripeToken = 'mocked-stripe-token';

  mockStripe.card.createToken = function(options, fn) {
    setTimeout(function(){
      fn(200, { id: stripeToken});
    }, 2);
  };

  stubRequest('post', `/organizations/:organization_id/subscriptions`, (req) => {
    assert.ok(true, 'updates subscription');
    assert.equal(req.json().stripe_token, stripeToken, 'posts stripe token');
    req.noContent();
  });

  stubOrganization();
  signInAndVisit(url);
  clickButton(updatePaymentMethodButton);
  andThen(() => {
    fillInput('number', cardNumber);
    fillInput('cvc', cardCvc);
    fillInput('exp-month', cardExpMonth);
    fillInput('exp-year', cardExpYear);
    fillInput('zip', cardZip);
    clickButton('Save', {context: find('form.stripe-cc-form')});
  });
});
