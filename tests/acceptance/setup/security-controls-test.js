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

module('Acceptance: Setup: Security Controls', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

let selectedDataEnvironments = { aptible: true, amazonS3: true, gmail: true };

test('Selected data environments are used to draw security control questionnaire', function(assert) {
  stubCurrentAttestations({ selected_data_environments: selectedDataEnvironments });
  stubProfile({ currentStep: 'security-controls' });
  stubRequests();
  signInAndVisit(securityControlsUrl);

  andThen(() => {
    // Should show AWS Provider questions

    assert.ok(find('.data-environment-provider.sm.aws').length, 'Has an AWS provider logo');
    assert.ok(find('.title:contains(AWS Security)').length, 'Has an AWS provider question');
    assert.ok(find('.panel-title:contains(S3)').length, 'Has an S3 panel');

    // Should show Google Provider questions
    assert.ok(find('.data-environment-provider.sm.google').length, 'Has an Google provider logo');
    assert.ok(find('.title:contains(How much security can your googles haz?)').length, 'Has a Google provider question');
    assert.ok(find('.panel-title:contains(Gmail)').length, 'Has Gmail DE panel');

    // Should show aptible security controls
    assert.ok(find('.panel-title:contains(Aptible)').length, 'Aptible controls');

    // Should show global security controls
    assert.ok(find('.panel-title:contains(Security Procedures)').length, 'Has security procedures panel');
    assert.ok(find('.panel-title:contains(Workforce Security Controls)').length, 'Has workforce controls panel');
    assert.ok(find('.panel-title:contains(Workstation Security Controls)').length, 'Has workstation controls panel');
    assert.ok(find('.panel-title:contains(Application Security Controls)').length, 'Has global application controls panel');

    // Aptible controls should be pre-selected
    ['secure0', 'secure1', 'secure2'].forEach((key) => {
      let input = find(`.provider-aptible .${key} input[name="${key}"]`);
      assert.ok(input.is(':checked'), `${key} is checked`);
    });
  });
});

test('Clicking back should return you to previous step', function(assert) {
  stubCurrentAttestations({ selected_data_environments: selectedDataEnvironments });
  stubProfile({ currentStep: 'security-controls' });
  stubRequests();
  signInAndVisit(securityControlsUrl);

  stubRequest('put', `/organization_profiles/${orgId}`, function(request) {
    let json = this.json(request);
    json.id = orgId;
    return this.success(json);
  });

  andThen(() => {
    find('.spd-back-button').click();
  });

  andThen(() => {
    assert.equal(currentPath(),
                 'organization.setup.data-environments',
                 'returned to data environments step');
  });
});

test('Clicking continue saves attestation for each global, provider, and data environment', function(assert) {
  expect(22);
  let attestationId = 0;
  let expectedAttestationHandles = ['aptible_security_controls',
                                    'aws_security_controls',
                                    'google_security_controls',
                                    'amazon_s3_security_controls',
                                    'gmail_security_controls',
                                    'security_procedures_security_controls',
                                    'workforce_security_controls',
                                    'workstation_security_controls',
                                    'application_security_controls'];

  stubCurrentAttestations({ selected_data_environments: selectedDataEnvironments });
  stubProfile({ currentStep: 'security-controls' });
  stubRequests();
  signInAndVisit(securityControlsUrl);

  stubRequest('put', `/organization_profiles/${orgId}`, function(request) {
    let json = this.json(request);
    json.id = orgId;

    assert.ok(true, 'updates organization profile');
    assert.equal(json.current_step, 'finish', 'updates current step');
    assert.equal(json.has_completed_setup, true, 'updates has completed setup');

    return this.success(json);
  });

  // Expect attestions to be posted to for each global, provider, and data environment
  stubRequest('post', '/attestations', function(request) {
    let json = this.json(request);

    assert.ok(true, 'posts to /attestations');
    assert.ok(expectedAttestationHandles.indexOf(json.handle) >= 0, `${json.handle} is a valid attestation handle`);

    return this.success({ id: attestationId++ });
  });

  andThen(() => {
    $('.x-toggle-container:not(.x-toggle-container-checked) label').click();
  });

  andThen(clickContinueButton);
  andThen(() => {
    assert.equal(currentPath(), 'organization.setup.finish', 'on finish setup step');
  });
});

test('Previous attestations are used to load existing security control answers', function(assert) {
  expect(38);
  let attestationId = 0;
  let expectedAttestationHandles = ['aptible_security_controls',
                                    'aws_security_controls',
                                    'google_security_controls',
                                    'amazon_s3_security_controls',
                                    'gmail_security_controls',
                                    'security_procedures_security_controls',
                                    'workforce_security_controls',
                                    'workstation_security_controls',
                                    'application_security_controls'];

  stubCurrentAttestations({
    selected_data_environments: selectedDataEnvironments,
    aptible_security_controls: { secure0: true, secure1: true, secure2: false },
    aws_security_controls: { mfa: true },
    google_security_controls: { security: 'Wow' },
    amazon_s3_security_controls: { encryption: 'Encrypt no secures' },
    gmail_security_controls: { linkSharingSettings: false },
    security_procedures_security_controls: { secureProcedure0: false },
    workforce_security_controls: { robots: true },
    workstation_security_controls: { keyboardLocks: 'Deadbolt' },
    application_security_controls: { hiddenTokens: false }
  });

  let expectedAttestationValues = {
    selected_data_environments: selectedDataEnvironments,
    aptible_security_controls: { secure0: true, secure1: true, secure2: false },
    aws_security_controls: { mfa: false },
    google_security_controls: { security: 'Wow' },
    amazon_s3_security_controls: { encryption: 'Encrypt some securities' },
    gmail_security_controls: { linkSharingSettings: false },
    security_procedures_security_controls: { secureProcedure0: false },
    workforce_security_controls: { robots: true },
    workstation_security_controls: { keyboardLocks: 'Deadbolt' },
    application_security_controls: { hiddenTokens: true }
  };

  stubProfile({ currentStep: 'security-controls' });
  stubRequests();
  signInAndVisit(securityControlsUrl);


  stubRequest('put', `/organization_profiles/${orgId}`, function(request) {
    let json = this.json(request);
    json.id = orgId;

    assert.ok(true, 'updates organization profile');
    assert.equal(json.current_step, 'finish', 'updates current step');
    assert.equal(json.has_completed_setup, true, 'updates has completed setup');

    return this.success(json);
  });

  // Expect attestions to be posted to for each global, provider, and data environment
  stubRequest('post', '/attestations', function(request) {
    let json = this.json(request);

    assert.ok(true, 'posts to /attestations');
    assert.ok(expectedAttestationHandles.indexOf(json.handle) >= 0, `${json.handle} is a valid attestation handle`);
    assert.deepEqual(json.document, expectedAttestationValues[json.handle]);

    return this.success({ id: attestationId++ });
  });

  andThen(() => {
    // Verify assertion data is used to seed initial UI state
    assertTrueSecurityControls(['mfa', 'secure0', 'secure1', 'robots'], assert);
    assertEnumSecurityControls({ security: 'Wow', encryption: 'Encrypt no secures', keyboardLocks: 'Deadbolt' }, assert);

    toggleSecurityControl('mfa');
    toggleSecurityControl('hiddenTokens');
    setEnumSecurityControl('encryption', 'Encrypt some securities');
  });

  andThen(clickContinueButton);
  andThen(() => {
    assert.equal(currentPath(), 'organization.setup.finish', 'on finish setup step');
  });
});

test('Saving progress', function(assert) {
  expect(34);
  let attestationId = 0;
  let expectedAttestationHandles = ['aptible_security_controls',
                                    'aws_security_controls',
                                    'google_security_controls',
                                    'amazon_s3_security_controls',
                                    'gmail_security_controls',
                                    'security_procedures_security_controls',
                                    'workforce_security_controls',
                                    'workstation_security_controls',
                                    'application_security_controls'];

  stubCurrentAttestations({
    selected_data_environments: selectedDataEnvironments,
    aptible_security_controls: { secure0: true, secure1: true, secure2: false },
    aws_security_controls: { mfa: true },
    google_security_controls: { security: 'Wow' },
    amazon_s3_security_controls: { encryption: 'Encrypt no secures' },
    gmail_security_controls: { linkSharingSettings: false },
    security_procedures_security_controls: { secureProcedure0: false },
    workforce_security_controls: { robots: true },
    workstation_security_controls: { keyboardLocks: 'Deadbolt' },
    application_security_controls: { hiddenTokens: false }
  });

  let expectedAttestationValues = {
    selected_data_environments: selectedDataEnvironments,
    aptible_security_controls: { secure0: true, secure1: true, secure2: false },
    aws_security_controls: { mfa: false },
    google_security_controls: { security: 'Wow' },
    amazon_s3_security_controls: { encryption: 'Encrypt some securities' },
    gmail_security_controls: { linkSharingSettings: false },
    security_procedures_security_controls: { secureProcedure0: false },
    workforce_security_controls: { robots: true },
    workstation_security_controls: { keyboardLocks: 'Deadbolt' },
    application_security_controls: { hiddenTokens: true }
  };

  stubProfile({ currentStep: 'security-controls' });
  stubRequests();
  signInAndVisit(securityControlsUrl);

  // Expect attestions to be posted to for each global, provider, and data environment
  stubRequest('post', '/attestations', function(request) {
    let json = this.json(request);

    assert.ok(true, 'posts to /attestations');
    assert.ok(expectedAttestationHandles.indexOf(json.handle) >= 0, `${json.handle} is a valid attestation handle`);
    assert.deepEqual(json.document, expectedAttestationValues[json.handle]);

    return this.success({ id: attestationId++ });
  });

  andThen(() => {
    // Verify assertion data is used to seed initial UI state
    assertTrueSecurityControls(['mfa', 'secure0', 'secure1', 'robots'], assert);
    assertEnumSecurityControls({ security: 'Wow', encryption: 'Encrypt no secures', keyboardLocks: 'Deadbolt' }, assert);

    toggleSecurityControl('mfa');
    toggleSecurityControl('hiddenTokens');
    setEnumSecurityControl('encryption', 'Encrypt some securities');
  });

  andThen(clickSaveButton);
});

skip('With no data environments configured it redirects back to data environment step');

function clickSaveButton() {
  let button = findWithAssert('button.spd-nav-save');
  button.click();
}

function assertTrueSecurityControls(controls, assert) {
  controls.forEach((control) => {
    let controlEl = findWithAssert(`.x-toggle[name="${control}"]`);
    assert.ok(controlEl.is(':checked'));
  });
}

function assertEnumSecurityControls(controls, assert) {
  for (var controlName in controls) {
    let controlEl = findWithAssert(`select[name="${controlName}"]`);
    assert.equal(controlEl.val(), controls[controlName]);
  }
}

function toggleSecurityControl(controlName) {
  let toggle = findWithAssert(`input[name="${controlName}"]`);
  toggle.click();
}

function setEnumSecurityControl(controlName, controlVal) {
  let option = findWithAssert(`option[value="${controlVal}"]`);
  let select = findWithAssert(`select[name="${controlName}"]`);

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
