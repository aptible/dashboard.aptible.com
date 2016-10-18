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
let dataEnvironmentsUrl = `/gridiron/${orgId}/admin/settings/data-environments`;
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
    type: 'compliance_owner',
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

module('Acceptance: Security Program Settings: Data Environments', {
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
    assert.equal(find('tr:contains(Aptible)').length, 1, 'has Aptible row');

    dataEnvironments.forEach(function(de) {
      if (de !== 'Aptible') {
        assert.ok(find(`td:contains(${de})`), `${de} is rendered`);
      }
    });
  });
});


skip('Clicking Save saves data environment selections to attestation', function(assert) {
  expect(3);
  stubCurrentAttestations({ selected_data_environments: { aptible: true }, team: [] });
  let expectedDataEnvironmentPayload = {
    amazonS3: true,
    aptible: true,
    gmail: true
  };

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
    toggleDataEnvironment('Amazon S3');
    toggleDataEnvironment('Gmail');
  });

  andThen(clickSaveButton);
});

skip('Should load existing selections when attestation already exists', function(assert) {
  expect(5);
  let existingSelection = {
    amazonS3: false,
    gmail: false,
  };

  let expectedDataEnvironmentPayload = {
    amazonS3: false,
    gmail: true,
    aptible: true
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
      if(deName !== 'aptible') {
        assert.equal(find(`input[name="${deName}"]`).is(':checked'), existingSelection[deName], `${deName} loaded`);
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

function toggleDataEnvironment(environment) {
  let toggle = findWithAssert(`tr:contains(${environment}) .x-toggle-btn`);
  toggle.click();
}

function clickSaveButton() {
  let button = findWithAssert('button.save-settings');
  button.click();
}

function stubRequests() {
  stubValidOrganization({ features: ['spd'] });
  stubSchemasAPI();
  stubCriterionDocuments({});
  stubStacks();
  stubCriteria();

  stubProfile({ hasCompletedSetup: true });

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