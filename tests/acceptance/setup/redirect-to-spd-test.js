import Ember from 'ember';
import { module, test, skip } from 'qunit';
import startApp from 'sheriff/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref, securityOfficerId,
         securityOfficerHref } from '../../helpers/organization-stub';
import { DATA_ENVIRONMENTS } from 'sheriff/setup/data-environments/route';

let application;
let startUrl = `${orgId}/setup/start`;
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

module('Acceptance: Security Program Design: Required', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('Loading Sheriff without completing SPD redirects you to start SPD', function(assert) {
  stubProfile({ hasCompletedSetup: false });
  stubRequests();
  signInAndVisit(`${orgId}/training`);

  andThen(() => {
    assert.equal(currentPath(), 'organization.setup.start', 'redirected to start SPD');
  });
});

test('Loading Sheriff with completed SPD does not redirect you', function(assert) {
  stubProfile({ hasCompletedSetup: true });
  stubRequests();
  signInAndVisit(`${orgId}/training`);

  andThen(() => {
    assert.equal(currentPath(), 'organization.engines.training.index', 'remains on current path');
  });
});

function stubRequests() {
  stubValidOrganization();
  stubSchemasAPI();
  stubCurrentAttestations({ workforce_roles: [
    { email: users[0].email, isDeveloper: false, isSecurityOfficer: false, isRobot: false, hasAptibleAccount: true }
  ] });

  stubRequest('get', '/criteria', function(request) {
    return this.success({ _embedded: { criteria: [] }});
  });

  stubRequest('get', '/documents', function(request) {
    return this.success({ _embedded: { documents: [] } });
  });

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