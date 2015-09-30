import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let application;

// FIXME this is hardcoded to match the value for signIn in
// aptible-helpers
const organizationId = 'o1';


const contactSettingsUrl = `/organizations/${organizationId}/contact-settings`;
const url = contactSettingsUrl;
const organizationApiUrl = `/organizations/${organizationId}`;
const billingDetailApiUrl = `/billing_details/${organizationId}`;

function buildUserData(){
  const ref = Ember.uuid();
  return {
    id: ref,
    name: `User ${ref}`
  };
}

function buildOrganizationData(data){
  return $.extend(true, {
    id: organizationId,
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
    stubOrganizations();
    stubStacks();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test(`visiting ${url} requires authentication`, () => {
  expectRequiresAuthentication(url);
});

test(`visiting ${url}`, function(assert) {
  assert.expect(14);
  let securityOfficerData = buildUserData();
  let billingContactData = buildUserData();
  let organizationData = buildOrganizationData({
    _links: {
      self: {href: organizationApiUrl},
      security_officer: {href: `/users/${securityOfficerData.id}`},
      billing_contact: {href: `/users/${billingContactData.id}`},
      users: {href: `${organizationApiUrl}/users`}
    }
  });

  stubBillingDetail({
    _links: {
      self: {href: billingDetailApiUrl},
      billing_contact: {href: `/users/${billingContactData.id}`}
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
    assert.equal(currentPath(), 'dashboard.organization.contact-settings');
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

test(`visiting ${url} and saving`, function(assert) {
  assert.expect(11);

  let securityOfficerData = buildUserData();
  let billingContactData = buildUserData();
  let organizationData = buildOrganizationData({
    _links: {
      self: {href: organizationApiUrl},
      security_officer: {href: `/users/${securityOfficerData.id}`},
      billing_contact: {href: `/users/${billingContactData.id}`},
      users: {href: `${organizationApiUrl}/users`}
    }
  });
  const newName = "Mike";

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
  stubBillingDetail({
    _links: {
      self: {href: billingDetailApiUrl},
      billing_contact: {href: `/users/${billingContactData.id}`}
    }
  });

  stubRequest('put', organizationApiUrl, function(request) {
    const body = this.json(request);
    assert.equal(body.name, newName, 'name is correct');
    assert.equal(body.security_alert_email, organizationData.security_alert_email, 'security alert email is correct');
    assert.equal(body.ops_alert_email, organizationData.ops_alert_email, 'ops alert email is correct');
    assert.equal(body.primary_phone, organizationData.primary_phone, 'primary phone is correct');
    assert.equal(body.emergency_phone, organizationData.emergency_phone, 'emergency phone is correct');
    assert.equal(body.address, organizationData.address, 'address is correct');
    assert.equal(body.city, organizationData.city, 'city is correct');
    assert.equal(body.state, organizationData.state, 'state is correct');
    assert.equal(body.zip, organizationData.zip, 'zip is correct');
    assert.equal(body.security_officer_id, securityOfficerData.id, 'security officer is correct');
    body.id = organizationId;
    return this.success(body);
  });

  stubRequest('put', billingDetailApiUrl, function(request) {
    const body = this.json(request);
    assert.equal(body.billing_contact_id, billingContactData.id, 'billing contact is correct');
    body.id = organizationId;
    return this.success(body);
  });

  signInAndVisit(url);
  fillInput('name', newName);
  clickButton('Save');
});

test(`visiting ${url} and saving with error`, function(assert) {
  assert.expect(1);

  let securityOfficerData = buildUserData();
  let billingContactData = buildUserData();
  let organizationData = buildOrganizationData({
    _links: {
      self: {href: organizationApiUrl},
      security_officer: {href: `/users/${securityOfficerData.id}`},
      billing_contact: {href: `/users/${billingContactData.id}`},
      users: {href: `${organizationApiUrl}/users`}
    }
  });
  stubBillingDetail({
    _links: {
      self: {href: billingDetailApiUrl},
      billing_contact: {href: `/users/${billingContactData.id}`}
    }
  });
  const newName = "Mike";

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

  stubRequest('put', organizationApiUrl, function() {
    return this.error(422, {
      code: 422,
      error: 'unprocessable_entity',
      message: 'Name is not valid'
    });
  });

  signInAndVisit(url);
  fillInput('name', newName);
  clickButton('Save');
  andThen(function(){
    const error = find(':contains(There was an error)');
    assert.ok(error.length, 'Errors are on the page');
  });
});
