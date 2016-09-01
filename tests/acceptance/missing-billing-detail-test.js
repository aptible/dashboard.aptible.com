import Ember from 'ember';
import { module, test } from 'qunit';
import { stubRequest } from "ember-cli-fake-server";
import startApp from '../helpers/start-app';

let application;

module('Acceptance: Missing Billing Detail', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('with only one organization', function(assert) {
  stubStacks();
  stubDatabaseImages();
  stubOrganization({ id: 1 });
  stubRequest('get', '/billing_details/1', (request) => request.notFound());

  signInAndVisit('/');

  andThen(function() {
    assert.equal(currentPath(), 'welcome.payment-info', 'redirected to payment info when all organizations lack billing detail');
  });
});

test('with more than one organization shows link to payment page', function(assert) {
  let organizations = [
    {
      id: 1, name: 'sprocket co',
      _links: {
        self: { href: '/organizations/1' },
        billing_detail: { href: '/billing_details/1' }
      }
    },
    {
      id: 2, name: 'sprocket co2',
      _links: {
        self: { href: '/organizations/2' },
        billing_detail: { href: '/billing_details/2' }
      }
    }
  ];
  stubRequest('get', '/organizations', function() {
    return this.success({ _embedded: { organizations }});
  });

  organizations.forEach((o) => {
    stubRequest('get', `/organizations/${o.id}`, function() {
      return this.success(o);
    });
  });

  stubBillingDetail({ id: 1 });
  stubRequest('get', '/billing_details/2', (request) => request.notFound());
  stubStacks();
  signInAndVisit('/');

  andThen(function() {
    assert.equal(currentPath(), 'enclave.stack.apps.index',
                 'was not redirected to payment info');
    let paymentLink = findWithAssert('.layout-sidebar .requires-payment-link');
    assert.equal(paymentLink.length, 1, 'shows requires payment link in sidebar');
    visit('/organizations/2');
  });

  andThen(function() {
    assert.equal(find('.alert:contains(missing payment information)').length, 1,
                'shows alert warning on organization section');
  });
});

