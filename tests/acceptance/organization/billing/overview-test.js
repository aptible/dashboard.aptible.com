import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../../../helpers/start-app';

let application;
const organizationId = '1';
const overviewUrl = `/organizations/${organizationId}/billing`;
const url = overviewUrl;

module('Acceptance: Organizations: Billing: Overview', {
  beforeEach: function() {
    application = startApp();
    stubOrganizations();
    stubStacks();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test(`visiting ${url} requires authentication`, () => {
  stubOrganization();
  stubBillingDetail();
  expectRequiresAuthentication(url);
});

test(`visiting ${url} shows current plan and resource usage`, (assert) => {
  let billingDetail = {
    id: organizationId,
    accountBalance: 0,
    planRate: 99900,
    coupon: null
  };
  stubStacks();
  stubOrganization({}, billingDetail);
  signInAndVisit(url);
  andThen(function() {
    assert.ok(find('h3:contains(Platform)').length, 'has a plan');
    assert.ok(find('.resource-usage-total .usage-value:contains($999)').length, 'has a base rate');
    assert.ok(find('.resource-metadata-title:contains("Current Balance")').length, 'renders current balance');
    assert.notOk(find('.sort-header:contains(Discounts)').length, 'has a discounts section');
    assert.ok(find('.resource-label:contains(Containers)').length, 'has a containers quote');
    assert.ok(find('.resource-label:contains(Disk)').length, 'has a disk quote');
    assert.ok(find('.resource-label:contains(Endpoints)').length, 'has an endpoints quote');
  });
});

test(`visiting ${url} shows current balance and discounts`, (assert) => {
  let billingDetail = {
    id: organizationId,
    accountBalance: -35000,
    planRate: 99900,
    coupon: {id: '30% OFF 3 months'}
  };
  stubStacks();
  stubOrganization({}, billingDetail);
  signInAndVisit(url);
  andThen(function() {
    assert.ok(find('.resource-metadata-title:contains("Current Balance")').length, 'renders current balance');
    assert.ok(find('.resource-metadata-value:contains("$-350.00")').length, 'renders current balance value');
    assert.ok(find('.sort-header:contains("Discounts")').length, 'has a discounts section');
    assert.ok(find('.panel-heading:contains("Credit")').length, 'has a credit item');
    assert.ok(find('.usage-value:contains("$350.00")').length, 'renders the current credit value');
    assert.ok(find('.panel-heading:contains("30% OFF 3 months")').length, 'renders a coupon');
  });
});
