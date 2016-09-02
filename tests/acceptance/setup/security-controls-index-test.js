import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref,
         securityOfficerHref } from '../../helpers/organization-stub';

let application;
let securityControlsUrl = `/gridiron/${orgId}/admin/setup/security-controls`;
let roleId = 'owners-role';
let userId = 'u1';
let roles = [
  {
    id: roleId,
    type: 'owner',
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

module('Acceptance: Setup: Security Controls Index', {
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
    assert.equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-admin.setup.security-controls.show');
  });
});

test('Resuming with existing attestations', function(assert) {
  stubCurrentAttestations({
    selected_data_environments: selectedDataEnvironments,
    google_security_controls: { security_controls: { security: { implemented: true } } }
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
    assert.equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-admin.setup.security-controls.show', 'on show page');

    assert.ok(find('input[name="security_controls.security.implemented"]').is(':checked'), 'Existing attestation is loaded');
  });
});

test('Clicking next will resume to first unfinished group', function(assert) {
  stubCurrentAttestations({
    selected_data_environments: selectedDataEnvironments,
    aws_security_controls: {},
    amazon_s3_security_controls: {}
  });
  stubProfile({ currentStep: 'security-controls'});
  stubRequests();
  signInAndVisit(securityControlsUrl);

  andThen(() => {
    let awsStep = findWithAssert('.panel.aws_security_controls');
    assert.ok(awsStep.hasClass('completed'), 'step is completed');

    let s3Step = findWithAssert('.panel.amazon_s3_security_controls');
    assert.ok(s3Step.hasClass('completed'), 'step is completed');
  });

  andThen(clickContinueButton);

  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-admin.setup.security-controls.show');
    let title = findWithAssert('.security-control-group-title');
    assert.ok(title.is(':contains(Google)'), 'on google security control group');
  });
});

test('Clicking next with all completed groups will finish SPD', function(assert) {
  expect(4);

  stubCurrentAttestations({
    selected_data_environments: selectedDataEnvironments,
    aws_security_controls: {},
    amazon_s3_security_controls: {},
    google_security_controls: {},
    application_security_controls: {},
    security_procedures_security_controls: {},
    workforce_security_controls: {},
    workstation_security_controls: {},
    aptible_security_controls: {},
    gmail_security_controls: {},
    email_security_controls: {},
    software_development_lifecycle_security_controls: {}
  });
  stubProfile({ currentStep: 'security-controls'});
  stubRequests();
  signInAndVisit(securityControlsUrl);

  stubRequest('put', `/organization_profiles/${orgId}`, function(request) {
    let json = this.json(request);
    json.id = orgId;

    assert.ok(true, 'updates organization profile');
    assert.equal(json.current_step, 'finish');
    assert.equal(json.has_completed_setup, true);

    return this.success(json);
  });

  andThen(clickContinueButton);

  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-admin.setup.finish');
  });
});

test('With no data environments configured it redirects back to data environment step', function(assert) {
  stubCurrentAttestations({ selected_data_environments: [] });
  stubProfile({ currentStep: 'security-controls'});
  stubRequests();
  signInAndVisit(securityControlsUrl);

  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-admin.setup.data-environments');
  });
});

function stubRequests() {
  stubValidOrganization();
  stubSchemasAPI();
  stubCriterionDocuments({});
  stubStacks();
  stubCriteria();

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
