import Ember from 'ember';
import { module, skip } from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref,
         securityOfficerHref } from '../../helpers/organization-stub';

let application;
let userId = 'basic-user-1';
let basicRoleId = 'basic-role-1';
let developerRoleId = 'developer-role-2';
let trainingUrl = `/gridiron/${orgId}/admin/training`;
let gridironAdminUrl = `/gridiron/${orgId}/admin`;
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

module('Acceptance: Security Program Design: Required', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('Loading compliance without starting SPD shows message to start', function(assert) {
  stubProfile({ hasCompletedSetup: false });
  stubRequests();
  signInAndVisit(gridironAdminUrl);

  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-admin.index', 'remain on gridiron admin page');
    assert.equal(find('.activate-notice:contains(Configure Your Security Program)').length, 1, 'shows message to start SPD');
  });
});

test('Loading compliance without completing SPD shows message to resume', function(assert) {
  stubProfile({ hasCompletedSetup: false, currentStep: 'team' });
  stubRequests();
  signInAndVisit(gridironAdminUrl);

  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-admin.index', 'remain on gridiron admin page');
    assert.equal(find('.activate-notice:contains(Resume Security Program Configuration)').length, 1, 'shows message to start SPD');
  });
});

skip('Loading compliance without completing SPD redirects you to start SPD', function(assert) {
  stubProfile({ hasCompletedSetup: false });
  stubRequests();
  signInAndVisit(trainingUrl);

  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-admin.setup.start', 'redirected to start SPD');
  });
});

skip('Loading compliance with completed SPD does not redirect you', function(assert) {
  stubProfile({ hasCompletedSetup: true });
  stubRequests();
  signInAndVisit(trainingUrl);

  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-admin.training', 'remains on current path');
  });
});

function stubRequests() {
  stubValidOrganization({ features: ['spd'] });
  stubSchemasAPI();
  stubCurrentAttestations({ workforce_roles: [
    { email: users[0].email, isDeveloper: false, isSecurityOfficer: false, isRobot: false, hasAptibleAccount: true }
  ] });
  stubCriterionDocuments({});
  stubStacks();
  stubCriteria();

  stubRequest('get', '/documents', function() {
    return this.success({ _embedded: { documents: [] } });
  });

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