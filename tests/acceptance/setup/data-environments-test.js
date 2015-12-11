import Ember from 'ember';
import { module, test, skip } from 'qunit';
import startApp from 'sheriff/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref, securityOfficerId,
         securityOfficerHref } from '../../helpers/organization-stub';

let application;
let dataEnvironmentsUrl = `${orgId}/setup/data-environments`;
let userId = 'basic-user-1';
let developerId = 'developer-user-2';
let basicRoleId = 'basic-role-1';
let developerRoleId = 'developer-role-2';
let dataEnvironments = ['Aptible', 'Amazon Simple Storage Service (Amazon S3)',
                        'Google Calendar', 'Google Drive', 'Gmail', 'Mailgun'];
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
    privileged: false,
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

test('Lists all data environments', function(assert) {
  stubCurrentAttestation('data-environments', []);
  stubProfile({ currentStep: 'data-environments' });
  stubRequests();
  signInAndVisit(dataEnvironmentsUrl);

  andThen(() => {
    let aptibleRow = findWithAssert('tr:contains(Aptible)');

    dataEnvironments.forEach(function(de) {
      assert.ok(find(`td:contains(${de})`), `${de} is rendered`);
    });

    assert.ok(aptibleRow.find('td:last input[type="checkbox"]').is(':disabled'),
              'Aptible is disabled');
    assert.ok(aptibleRow.find('td:last .x-toggle-container-checked').length,
              'Aptible is pre-selected');
  });
});

test('Clicking back should return you to previous step', function(assert) {
  stubCurrentAttestation('data-environments', []);
  stubCurrentAttestation('team', []);
  stubProfile({ currentStep: 'data-environments' });
  stubRequests();
  signInAndVisit(dataEnvironmentsUrl);

  stubRequest('put', `/organization_profiles/${orgId}`, function(request) {
    let json = this.json(request);
    json.id = orgId;
    return this.success(json);
  });

  andThen(() => {
    find('button:contains(Back)').click();
  });

  andThen(() => {
    assert.equal(currentPath(), 'organization.setup.team.index', 'returned to team step');
  });
});

test('Clicking continue saves data environment selections to organization profile', function(assert) {
  expect(6);
  stubCurrentAttestation('data-environments', { aptible: true });
  let expectedDataEnvironmentPayload = {
    amazonS3: true,
    aptible: true,
    gmail: true,
    googleCalendar: false,
    googleDrive: false,
    mailgun: true
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

  stubRequest('post', '/attestations', function(request) {
    let json = this.json(request);

    assert.ok(true, 'posts to /attestations');
    assert.equal(json.handle, 'data-environments', 'includes attestation handle');
    assert.deepEqual(json.document, expectedDataEnvironmentPayload, 'includes selected data environments as a document payload');

    return this.success({ id: 1 });
  });

  andThen(() => {
    toggleDataEnvironment('Amazon S3');
    toggleDataEnvironment('Gmail');
    toggleDataEnvironment('Mailgun');
  });

  andThen(clickContinueButton);

  andThen(() => {
    assert.equal(currentPath(), 'organization.setup.security-controls', 'proceeds to next step');
  });
});

test('Should load existing selections when attestation already exists', function(assert) {
  expect(12);
  let existingSelection = {
    amazonS3: false,
    aptible: true,
    gmail: false,
    googleCalendar: true,
    googleDrive: false,
    mailgun: true
  };

  let expectedDataEnvironmentPayload = {
    amazonS3: false,
    aptible: true,
    gmail: true,
    googleCalendar: true,
    googleDrive: false,
    mailgun: true
  };

  stubCurrentAttestation('data-environments', existingSelection);
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

  stubRequest('post', '/attestations', function(request) {
    let json = this.json(request);

    assert.ok(true, 'posts to /attestations');
    assert.equal(json.handle, 'data-environments', 'includes attestation handle');
    assert.deepEqual(json.document, expectedDataEnvironmentPayload, 'includes selected data environments as a document payload');

    return this.success({ id: 1 });
  });

  andThen(() => {
    // For each DE verify toggle state matches existing attestation
    for(var deName in existingSelection) {
      assert.equal(find(`input[name="${deName}"]`).is(':checked'), existingSelection[deName]);
    }
  });

  andThen(() => {
    // Toggle Gmail
    toggleDataEnvironment('Gmail');
  });

  // Save and inspect attestation for updated values
  andThen(clickContinueButton);

  andThen(() => {
    assert.equal(currentPath(), 'organization.setup.security-controls', 'proceeds to next step');
  });
});

function toggleDataEnvironment(environment) {
  let toggle = findWithAssert(`tr:contains(${environment}) td:last input[type="checkbox"]`);
  toggle.click();
}

function stubRequests() {
  stubValidOrganization();

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

  stubRequest('get', '/permissions', function(request) {
    return this.success({ _embedded: { permissions }});
  });
}