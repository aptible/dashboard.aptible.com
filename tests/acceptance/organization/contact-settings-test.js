import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import { stubRequest } from "diesel/tests/helpers/fake-server";

let application;

// FIXME this is hardcoded to match the value for signIn in
// aptible-helpers
const organizationId = 'o1';


const contactSettingsUrl = `/organizations/${organizationId}/contact-settings`;
const url = contactSettingsUrl;
const organizationApiUrl = `/organizations/${organizationId}`;

function buildUserData(){
  const ref = Ember.uuid();
  return {
    id: ref,
    name: `User ${ref}`
  };
}

function buildOrganziationData(data){
  return $.extend({
    name: 'Bob',
    security_alert_email: 'security@bob.co',
    ops_alert_email: 'ops@bob.co',
    primary_phone: '111 111 1111',
    emergency_phone: '222 222 2222',
    address: '1600 Pennsylvania Ave',
    city: 'Northwest',
    state: 'Washington DC',
    zip: '20500'
  }, data);
}

module('Acceptance: OrganizationContactSettings', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test(`visiting ${url} requires authentication`, () => {
  expectRequiresAuthentication(url);
});

test(`visiting ${url}`, function(assert) {
  let securityOfficerData = buildUserData();
  let billingContactData = buildUserData();
  let organizationData = buildOrganziationData({
    _links: {
      self: {href: organizationApiUrl},
      security_officer: {href: `/users/${securityOfficerData.id}`},
      billing_contact: {href: `/users/${billingContactData.id}`},
      users: {href: `${organizationApiUrl}/users`}
    }
  });
  stubOrganization(organizationData);
  stubUser(securityOfficerData);
  stubUser(billingContactData);
  stubRequest('get', `${organizationApiUrl}/users`, function() {
    return this.success({
      _embedded: {
        users: [{
          id: 'some-bozo',
          name: 'named bozo'
        }, securityOfficerData, billingContactData]
      }
    });
  });
  signInAndVisit(url);

  andThen(function() {
    assert.equal(currentPath(), 'organization.contact-settings');
    expectInput('name', {value: organizationData.name});
    expectInput('primary-phone', {value: organizationData.primaryPhone});
    expectInput('emergency-phone', {value: organizationData.emergencyPhone});
    expectInput('address', {value: organizationData.address});
    expectInput('city', {value: organizationData.city});
    expectInput('state', {value: organizationData.state});
    expectInput('zip', {value: organizationData.zip});
    expectInput('security-alert-email', {value: organizationData.securityAlertEmail});
    expectInput('ops-alert-email', {value: organizationData.opsAlertEmail});
    expectInput('ops-alert-email', {value: organizationData.opsAlertEmail});
    expectInput('security-officer', {value: securityOfficerData.id});
    expectInput('billing-contact', {value: billingContactData.id});
    expectButton('Save');
  });
});
