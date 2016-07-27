import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref, securityOfficerId,
         securityOfficerHref } from '../../helpers/organization-stub';

let application;
let teamUrl = `/compliance/${orgId}/setup/team`;
let userId = 'basic-user-1';
let developerId = 'developer-user-2';
let basicRoleId = 'basic-role-1';
let developerRoleId = 'developer-role-2';
let platformOwnerId = 'platform-owner-role-3';
let complianceOwnerId = 'compliance-owner-role-4';
let users = [
  {
    id: userId,
    name: 'Basic User',
    email: 'basicuser@asdf.com',
    _links: {
      self: { href: `/users/${userId}` }
    }
  },
  {
    id: developerId,
    name: 'Developer User',
    email: 'developeruser@asdf.com',
    _links: {
      self: { href: `/users/${developerId}` }
    }
  },
  {
    id: securityOfficerId,
    name: 'Security Officer User',
    email: 'securityofficeruser@asdf.com',
    _links: {
      self: { href: `/users/${securityOfficerId}` }
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
  },
  {
    id: developerRoleId,
    type: 'platform_user',
    name: 'Developer Role',
    _links: {
      self: { href: `/roles/${developerRoleId}` },
      users: { href: `/roles/${developerRoleId}/users`}
    }
  },
  {
    id: platformOwnerId,
    type: 'platform_owner',
    name: 'Platform Owner',
    _links: {
      self: { href: `/roles/${platformOwnerId}` },
      users: { href: `/roles/${platformOwnerId}/users`}
    }
  },
  {
    id: complianceOwnerId,
    type: 'compliance_owner',
    name: 'Compliance Owner',
    _links: {
      self: { href: `/roles/${complianceOwnerId}` },
      users: { href: `/roles/${complianceOwnerId}/users`}
    }
  }
];

let invitations = [
  {
    id: 'invite-1',
    role_id: basicRoleId,
    inviter_id: users[0].id,
    email: 'newuser1@aptible.com',
    created_at: '2015-11-03T20:34:06.963Z'
  },
  {
    id: 'invite-2',
    role_id: basicRoleId,
    inviter_id: users[0].id,
    email: 'newuser2@aptible.com',
    created_at: '2015-11-03T20:34:06.963Z'
  }
];

let permissions = [
  {
    id: '1',
    scope: 'manage',
    _links: {
      role: { href: `/roles/${developerRoleId}` }
    }
  },
  {
    id: '2',
    scope: 'read',
    _links: {
      role: { href: `/roles/${basicRoleId}` }
    }
  }
];

module('Acceptance: Setup: Team', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('You are redirected to correct step if not ready for team step', function(assert) {
  stubCurrentAttestations({ workforce_roles: [] });
  stubProfile({ currentStep: 'organization' });
  stubRequests();
  signInAndVisit(teamUrl);

  andThen(() => {
    assert.equal(currentPath(), 'compliance.compliance-organization.setup.organization', 'redirected to organization step');
  });
});

test('Clicking back should return you to previous step', function(assert) {
  stubCurrentAttestations({ workforce_roles: [], workforce_locations: [] });
  stubProfile({ currentStep: 'team' });
  stubRequests();
  signInAndVisit(teamUrl);

  stubRequest('put', `/organization_profiles/${orgId}`, function(request) {
    let json = this.json(request);
    json.id = orgId;
    return this.success(json);
  });

  andThen(() => {
    find('.spd-nav-back').click();
  });

  andThen(() => {
    assert.equal(currentPath(), 'compliance.compliance-organization.setup.locations', 'returned to locations step');
  });
});

function stubRequests(options) {
  stubValidOrganization(options);
  stubSchemasAPI();

  stubRequest('get', `/roles/${developerRoleId}/users`, function() {
    return this.success({ _embedded: { users: [users[1]] }});
  });

  stubRequest('get', rolesHref, function() {
    return this.success({ _embedded: { roles } });
  });

  stubRequest('get', usersHref, function() {
    return this.success({ _embedded: { users }});
  });

  stubRequest('get', invitationsHref, function() {
    return this.success({ _embedded: { invitations }});
  });

  stubRequest('get', securityOfficerHref, function() {
    return this.success(users[2]);
  });

  stubRequest('get', '/permissions', function() {
    return this.success({ _embedded: { permissions }});
  });
}
