import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';

let application;
const organizationId = 'o1';
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
  stubStacks();
  stubOrganization();
  stubOrganizations();
  stubBillingDetail();
  signInAndVisit(url);
  andThen(function() {
    assert.ok(find('h3:contains(Platform)').length, 'has a plan');
    assert.ok(find('.resource-usage-total .usage-value:contains($499)').length, 'has a base rate');
    assert.ok(find('.resource-label:contains(Containers)').length, 'has a containers quote');
    assert.ok(find('.resource-label:contains(Disk)').length, 'has a disk quote');
    assert.ok(find('.resource-label:contains(Domains)').length, 'has a domains quote');
  });
});
