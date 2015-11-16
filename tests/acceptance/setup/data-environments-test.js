import Ember from 'ember';
import { module, test, skip } from 'qunit';
import startApp from 'sheriff/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref, securityOfficerId,
         securityOfficerHref } from '../../helpers/organization-stub';
import { DATA_ENVIRONMENTS } from 'sheriff/setup/data-environments/route';

let application;
let dataEnvironmentsUrl = `${orgId}/setup/data-environments`;
let userId = 'basic-user-1';
let developerId = 'developer-user-2';
let basicRoleId = 'basic-role-1';
let developerRoleId = 'developer-role-2';

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
  stubProfile({ currentStep: 'data-environments' });
  stubRequests();
  signInAndVisit(dataEnvironmentsUrl);

  andThen(() => {
    let aptibleRow = findWithAssert('tr:contains(Aptible)');

    DATA_ENVIRONMENTS.forEach(function(env) {
      assert.ok(find(`td:contains(${env.name})`), `${env.name} is rendered`);
    });

    assert.ok(aptibleRow.find('td:last input[type="checkbox"]').is(':disabled'),
              'Aptible is disabled');
    assert.ok(aptibleRow.find('td:last .x-toggle-container-checked').length,
              'Aptible is pre-selected');
  });
});

test('Clicking continue saves data environment selections to organization profile', function(assert) {
  expect(6);

  let expectedDataEnvironmentPayload = [
    { name: 'Aptible PaaS', provider: 'aptible', handle: 'aptible', selected: true },
    { name: 'S3', provider: 'aws', handle: 's3', selected: true },
    { name: 'GMail', provider: 'google', handle: 'gmail', selected: true },
    { name: 'Laptops', provider: false, handle: 'laptops', selected: true }
  ];

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
    assert.equal(json.handle, 'selected-data-environments', 'includes attestation handle');
    assert.deepEqual(json.document, expectedDataEnvironmentPayload, 'includes selected data environments as a document payload');

    return this.success({ id: 1 });
  });

  andThen(() => {
    enableDataEnvironment('S3');
    enableDataEnvironment('GMail');
    enableDataEnvironment('Laptops');
  });

  andThen(clickContinueButton);

  andThen(() => {
    assert.equal(currentPath(), 'organization.setup.security-controls', 'proceeds to next step');
  });
});

function enableDataEnvironment(environment) {
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

  stubRequest('get', securityOfficerHref, function(request) {
    return this.success(users[0]);
  });

  stubRequest('get', '/permissions', function(request) {
    return this.success({ _embedded: { permissions }});
  });
}