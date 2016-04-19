import Ember from 'ember';
import { module, test, skip } from 'qunit';
import startApp from 'sheriff/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref, securityOfficerId,
         securityOfficerHref } from '../../helpers/organization-stub';

let application;
let securityControlsUrl = `${orgId}/setup/security-controls`;
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

module('Acceptance: Setup: Security Control Group', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

let selectedDataEnvironments = { aptible: true, amazonS3: true, gmail: true };

test('clicking next will save and go to next security control group', function(assert) {
  expect(4);
  stubCurrentAttestations({
    selected_data_environments: selectedDataEnvironments,
    aws_security_controls: {},
    amazon_s3_security_controls: {}
  });
  stubProfile({ currentStep: 'security-controls'});
  stubRequests();
  signInAndVisit(`${securityControlsUrl}/amazon_s3_security_controls`);

  stubRequest('post', '/attestations', function(request) {
    let json = this.json(request);

    assert.ok(true, 'posts to /attestations');
    assert.equal(json.handle, 'amazon_s3_security_controls');

    return this.success({ id: 1 });
  });

  andThen(() => {
    let title = findWithAssert('.security-control-group-title');
    assert.ok(title.is(':contains(Amazon S3)'), 'amazon s3 control group');
  });

  andThen(clickContinueButton);

  andThen(() => {
    let title = findWithAssert('.security-control-group-title');
    assert.ok(title.is(':contains(Google)'), 'on next control group');
  });
});

test('clicking next will finish SPD if on last group', function(assert) {
  expect(7);
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
  signInAndVisit(`${securityControlsUrl}/software_development_lifecycle_security_controls`);

  stubRequest('post', '/attestations', function(request) {
    let json = this.json(request);

    assert.ok(true, 'posts to /attestations');
    assert.equal(json.handle, 'software_development_lifecycle_security_controls');

    return this.success({ id: 1 });
  });

  stubRequest('put', `/organization_profiles/${orgId}`, function(request) {
    let json = this.json(request);
    json.id = orgId;

    assert.ok(true, 'updates organization profile');
    assert.equal(json.current_step, 'finish', 'on finish step');
    assert.equal(json.has_completed_setup, true, 'has completed spd');

    return this.success(json);
  });

  andThen(() => {
    let title = findWithAssert('.security-control-group-title');
    assert.ok(title.is(':contains(Software)'), 'sdlc control group');
  });

  andThen(clickContinueButton);

  andThen(() => {
    assert.equal(currentPath(), 'organization.setup.finish');
  });
});

test('clicking previous will go to previous group', function(assert) {
  expect(2);

  stubCurrentAttestations({
    selected_data_environments: selectedDataEnvironments,
    aws_security_controls: {},
    amazon_s3_security_controls: {}
  });
  stubProfile({ currentStep: 'security-controls'});
  stubRequests();
  signInAndVisit(`${securityControlsUrl}/amazon_s3_security_controls`);

  andThen(() => {
    let title = findWithAssert('.security-control-group-title');
    assert.ok(title.is(':contains(Amazon S3)'), 'amazon s3 control group');
  });

  andThen(clickBackButton);

  andThen(() => {
    let title = findWithAssert('.security-control-group-title');
    assert.ok(title.is(':contains(Amazon Web Services)'), 'on next control group');
  });
});

test('clicking previous will go to index when on first group', function(assert) {
  expect(2);

  stubCurrentAttestations({
    selected_data_environments: selectedDataEnvironments,
    aws_security_controls: {},
    amazon_s3_security_controls: {}
  });
  stubProfile({ currentStep: 'security-controls'});
  stubRequests();
  signInAndVisit(`${securityControlsUrl}/aws_security_controls`);

  andThen(() => {
    let title = findWithAssert('.security-control-group-title');
    assert.ok(title.is(':contains(Amazon Web Services)'), 'amazon s3 control group');
  });

  andThen(clickBackButton);

  andThen(() => {
    assert.equal(currentPath(), 'organization.setup.security-controls.index', 'on security control index page');
  });
});

function clickSaveButton() {
  let button = findWithAssert('button.spd-nav-save');
  button.click();
}

function assertTrueSecurityControls(controls, assert) {
  controls.forEach((control) => {
    let controlEl = findWithAssert(`.x-toggle[name="${control}.implemented"]`);
    assert.ok(controlEl.is(':checked'));
  });
}

function assertEnumSecurityControls(controls, assert) {
  for (var controlName in controls) {
    let controlEl = findWithAssert(`select[name="${controlName}.technologies"]`);
    assert.equal(controlEl.val(), controls[controlName]);
  }
}

function toggleSecurityControl(controlName) {
  let toggle = findWithAssert(`input[name="${controlName}.implemented"]`);
  toggle.click();
}

function setEnumSecurityControl(controlName, controlVal) {
  let option = findWithAssert(`option[value="${controlVal}"]`);
  let select = findWithAssert(`select[name="${controlName}.technologies"]`);

  Ember.run(function() {
    select.val(controlVal);
    select.trigger('change');
  });
}

function stubRequests() {
  stubValidOrganization();
  stubSchemasAPI();

  stubRequest('get', rolesHref, function(request) {
    return this.success({ _embedded: { roles } });
  });

  stubRequest('get', usersHref, function(request) {
    return this.success({ _embedded: { users }});
  });

  stubRequest('get', invitationsHref, function(request) {
    return this.success({ _embedded: { invitations: [] }});
  });

  stubRequest('get', securityOfficerHref, function(request) {
    return this.success(users[0]);
  });
}
