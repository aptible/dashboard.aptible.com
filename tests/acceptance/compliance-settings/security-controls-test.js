import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref,
         securityOfficerHref } from '../../helpers/organization-stub';

let application;
let securityControlsUrl = `/compliance/${orgId}/settings/security-controls`;
let roleId = 'owners-role';
let userId = 'u1';
let roles = [
  {
    id: roleId,
    privileged: true,
    name: 'Owners',
    _links: {
      self: { href: `/roles/${roleId}` },
      users: { href: `/roles/${roleId}/users`}
    }
  }
];

let users = [
  {
    id: userId,
    name: 'Basic User',
    email: 'basicuser@asdf.com',
    _links: {
      self: { href: `/users/${userId}` }
    }
  }
];

module('Acceptance: Security Program Settings: Security Controls Index', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

let selectedDataEnvironments = { aptible: true, amazonS3: true, gmail: true };
let expectedSecurityControlGroups = ['Amazon Web Services', 'Amazon S3',
                                     'Google', 'Gmail', 'Application Security Controls',
                                     'Security Procedures', 'Workforce Security Controls',
                                     'Workstation Controls', 'Aptible'];


test('Basic UI', function(assert) {
  stubCurrentAttestations({ selected_data_environments: selectedDataEnvironments });
  stubProfile({ currentStep: 'security-controls'});
  stubRequests();
  signInAndVisit(securityControlsUrl);

  andThen(() => {
    expectedSecurityControlGroups.forEach((groupName) => {
      assert.ok(find(`.info .title:contains(${groupName})`).length, `shows ${groupName}`);
    });

    let googleStep = findWithAssert('.panel.google_security_controls');
    let getStarted = googleStep.find('.start-security-control-group');
    assert.ok(getStarted.length, 'Has get started button');
    getStarted.click();
  });

  andThen(() => {
    assert.equal(currentPath(), 'compliance.compliance-organization.setup.security-controls.show', 'on show page');
  });
});

test('Resuming with existing attestations', function(assert) {
  stubCurrentAttestations({
    selected_data_environments: selectedDataEnvironments,
    google_security_controls: { security: { implemented: true }}
  });
  stubProfile({ currentStep: 'security-controls'});
  stubRequests();
  signInAndVisit(securityControlsUrl);

  andThen(() => {
    let googleStep = findWithAssert('.panel.google_security_controls');
    assert.ok(googleStep.hasClass('completed'), 'step is completed');
    assert.ok(googleStep.find('.fa.fa-check').length, 'has checkmark');

    googleStep.click();
  });

  andThen(() => {
    assert.equal(currentPath(), 'compliance.compliance-organization.setup.security-controls.show');

    assert.ok(find('input[name="security.implemented"]').is(':checked'), 'Existing attestation is loaded');
  });
});

function stubRequests() {
  stubValidOrganization();
  stubSchemasAPI();

  stubRequest('get', rolesHref, function() {
    return this.success({ _embedded: { roles } });
  });

  stubRequest('get', usersHref, function() {
    return this.success({ _embedded: { users }});
  });

  stubRequest('get', invitationsHref, function() {
    return this.success({ _embedded: { invitations: [] }});
  });

  stubRequest('get', securityOfficerHref, function() {
    return this.success(users[0]);
  });
}
