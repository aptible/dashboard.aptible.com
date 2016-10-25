//
// Skipping for now since data environments are currently removed
// TODO: Re-enable tests once DEs have returned to SPD
import Ember from 'ember';
import { module, skip } from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref,
         securityOfficerHref } from '../../helpers/organization-stub';

let application;
let attestationHandle = 'selected_data_environments';
let dataEnvironmentsUrl = `/gridiron/${orgId}/admin/setup/data-environments`;
let userId = 'basic-user-1';
let basicRoleId = 'basic-role-1';
let developerRoleId = 'developer-role-2';
let dataEnvironments = ['Aptible', 'Amazon Simple Storage Service (Amazon S3)', 'Gmail'];
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

let roles = [
  {
    id: basicRoleId,
    type: 'platform_user',
    name: 'Basic Role',
    _links: {
      self: { href: `/roles/${basicRoleId}` },
      users: { href: `/roles/${basicRoleId}/users`}
    }
  }
];

let permissions = [
  {
    id: '1',
    scope: 'manage',
    _links: {
      role: { href: `/roles/${developerRoleId}` }
    }
  }
];

module('Acceptance: Setup: Data Environments', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

skip('Lists all data environments', function(assert) {
  stubCurrentAttestations(attestationHandle, []);
  stubProfile({ currentStep: 'data-environments' });
  stubRequests();
  signInAndVisit(dataEnvironmentsUrl);

  andThen(() => {
    assert.equal(find('tr:contains(Aptible)').length, 1, 'has no Aptible row');

    dataEnvironments.forEach(function(de) {
      if (de !== 'Aptible') {
        assert.ok(find(`td:contains(${de})`), `${de} is rendered`);
      }
    });
  });
});

skip('Clicking back should return you to previous step', function(assert) {
  stubCurrentAttestations({ selected_data_environments: {}, workforce_roles: [] });
  stubProfile({ currentStep: 'data-environments' });
  stubRequests();
  signInAndVisit(dataEnvironmentsUrl);

  stubRequest('put', `/organization_profiles/${orgId}`, function(request) {
    let json = this.json(request);
    json.id = orgId;
    return this.success(json);
  });

  andThen(() => {
    find('.spd-nav-back').click();
  });

  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-admin.gridiron-setup.team', 'returned to team step');
  });
});

skip('Clicking continue saves data environment selections to organization profile', function(assert) {
  expect(6);
  stubCurrentAttestations({selected_data_environments: { aptible: true }, team: [] });
  let expectedDataEnvironmentPayload = {
    amazonS3: true,
    aptible: true,
    gmail: true
  };

  stubProfile({ currentStep: 'data-environments' });
  stubRequests();
  signInAndVisit(dataEnvironmentsUrl);

  stubRequest('put', `/organization_profiles/${orgId}`, function(request) {
    let json = this.json(request);
    json.id = orgId;

    assert.ok(true, 'updates organization profile');
    assert.equal(json.current_step, 'security-controls', 'updates current step');

    return this.success(json);
  });

  stubRequest('post', `/organization_profiles/${orgId}/attestations`, function(request) {
    let json = this.json(request);

    assert.ok(true, 'posts to /attestations');
    assert.equal(json.handle, attestationHandle, 'includes attestation handle');
    assert.deepEqual(json.document, expectedDataEnvironmentPayload, 'includes selected data environments as a document payload');

    return this.success({ id: 1 });
  });

  andThen(() => {
    toggleDataEnvironment('Amazon S3');
    toggleDataEnvironment('Gmail');
  });

  andThen(clickContinueButton);

  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-admin.gridiron-setup.security-controls.index', 'proceeds to next step');
  });
});

skip('Should load existing selections when attestation already exists', function(assert) {
  expect(8);
  let existingSelection = {
    amazonS3: false,
    aptible: true,
    gmail: false,
  };

  let expectedDataEnvironmentPayload = {
    amazonS3: false,
    aptible: true,
    gmail: true,
  };

  stubCurrentAttestations({ selected_data_environments: existingSelection });
  stubProfile({ currentStep: 'data-environments' });
  stubRequests();
  signInAndVisit(dataEnvironmentsUrl);

  stubRequest('put', `/organization_profiles/${orgId}`, function(request) {
    let json = this.json(request);
    json.id = orgId;

    assert.ok(true, 'updates organization profile');
    assert.equal(json.current_step, 'security-controls', 'updates current step');

    return this.success(json);
  });

  stubRequest('post', `/organization_profiles/${orgId}/attestations`, function(request) {
    let json = this.json(request);

    assert.ok(true, 'posts to /attestations');
    assert.equal(json.handle, attestationHandle, 'includes attestation handle');
    assert.deepEqual(json.document, expectedDataEnvironmentPayload, 'includes selected data environments as a document payload');

    return this.success({ id: 1 });
  });

  andThen(() => {
    // For each DE verify toggle state matches existing attestation
    for(var deName in existingSelection) {
      if (deName !== 'aptible') {
        assert.equal(find(`input[name="${deName}"]`).is(':checked'), existingSelection[deName]);
      }
    }
  });

  andThen(() => {
    // Toggle Gmail
    toggleDataEnvironment('Gmail');
  });

  // Save and inspect attestation for updated values
  andThen(clickContinueButton);

  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-admin.gridiron-setup.security-controls.index', 'proceeds to next step');
  });
});

skip('Save progress', function(assert) {
  expect(5);
  let existingSelection = {
    amazonS3: false,
    aptible: true,
    gmail: false,
  };

  let expectedDataEnvironmentPayload = {
    amazonS3: false,
    aptible: true,
    gmail: true,
  };

  stubCurrentAttestations({ selected_data_environments: existingSelection });
  stubProfile({ currentStep: 'data-environments' });
  stubRequests();
  signInAndVisit(dataEnvironmentsUrl);

  stubRequest('post', `/organization_profiles/${orgId}/attestations`, function(request) {
    let json = this.json(request);

    assert.ok(true, 'posts to /attestations');
    assert.equal(json.handle, attestationHandle, 'includes attestation handle');
    assert.deepEqual(json.document, expectedDataEnvironmentPayload, 'includes selected data environments as a document payload');

    return this.success({ id: 1 });
  });

  andThen(() => {
    // For each DE verify toggle state matches existing attestation
    for(var deName in existingSelection) {
      if (deName !== 'aptible') {
        assert.equal(find(`input[name="${deName}"]`).is(':checked'), existingSelection[deName], `${deName} set correctly`);
      }
    }
  });

  andThen(() => {
    // Toggle Gmail
    toggleDataEnvironment('Gmail');
  });

  // Save and inspect attestation for updated values
  andThen(clickSaveButton);
});

function clickSaveButton() {
  let button = findWithAssert('button.spd-nav-save');
  button.click();
}

function toggleDataEnvironment(environment) {
  let toggle = findWithAssert(`tr:contains(${environment}) td:last .x-toggle-btn`);
  toggle.click();
}

function stubRequests() {
  stubValidOrganization({ features: ['spd'] });
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

  stubRequest('get', '/permissions', function() {
    return this.success({ _embedded: { permissions }});
  });
}