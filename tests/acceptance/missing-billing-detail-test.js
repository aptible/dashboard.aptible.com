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
  stubOrganizations();
  stubStacks();
  stubOrganization({ id: 1 });
  stubRequest('get', '/billing_details/1', (request) => request.notFound());

  signInAndVisit('/');

  andThen(function() {
    assert.equal(currentPath(), 'welcome.payment-info', 'redirected to payment info when all organizations lack billing detail');
  });
});

test('with more than one organization', function(assert) {
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
  stubBillingDetail({ id: 1 });
  stubRequest('get', '/billing_details/2', (request) => request.notFound());
  stubRequest('get', '/organizations', function(request) {
    return this.success({
      _links: {},_embedded: { organizations }
    });
  });
  stubOrganization({ id: 1 });

  stubStacks();
  signInAndVisit('/');

  andThen(function() {
    assert.equal(currentPath(), 'dashboard.catch-redirects.stack.apps.index', 'was not redirected to payment info');
  })
});
