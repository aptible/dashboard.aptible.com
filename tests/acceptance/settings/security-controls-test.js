import Ember from 'ember';
import { module, test, skip } from 'qunit';
import startApp from 'sheriff/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref, securityOfficerId,
         securityOfficerHref } from '../../helpers/organization-stub';

let application;
let securityControlsUrl = `${orgId}/settings/security-controls`;
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
    assert.equal(currentPath(), 'organization.setup.security-controls.show', 'on show page');
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
    assert.equal(currentPath(), 'organization.setup.security-controls.show');

    assert.ok(find('input[name="security.implemented"]').is(':checked'), 'Existing attestation is loaded');
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
