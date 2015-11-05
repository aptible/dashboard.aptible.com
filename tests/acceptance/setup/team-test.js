import Ember from 'ember';
import { module, test, skip } from 'qunit';
import startApp from 'sheriff/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref, securityOfficerId,
         securityOfficerHref } from '../../helpers/organization-stub';

let application;
let teamUrl = `${orgId}/setup/team`;
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
    privileged: false,
    name: 'Basic Role',
    _links: {
      self: { href: `/roles/${basicRoleId}` },
      users: { href: `/roles/${basicRoleId}/users`}
    }
  },
  {
    id: developerRoleId,
    privileged: false,
    name: 'Developer Role',
    _links: {
      self: { href: `/roles/${developerRoleId}` },
      users: { href: `/roles/${developerRoleId}/users`}
    }
  }
];

let invites = [
  {
    role_id: basicRoleId,
    inviter_id: users[0].id,
    email: 'newuser1@aptible.com'
  },
  {
    role_id: basicRoleId,
    inviter_id: users[0].id,
    email: 'newuser2@aptible.com'
  },
  {
    role_id: basicRoleId,
    inviter_id: users[0].id,
    email: 'newuser3@aptible.com'
  },
]

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

module('Acceptance: Setup: Locations', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

module('Acceptance: Setup: Team', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('Team shows all organization users', function(assert) {
  stubProfile({ currentStep: 'team' });
  stubRequests();
  signInAndVisit(teamUrl);

  andThen(() => {
    users.forEach((user) => {
      assert.ok(find(`td strong:contains(${user.name})`).length, 'has user');
    });
  });
});

test('Invitations tab shows all pending invitations', function(assert) {
  stubProfile({ currentStep: 'team' });
  stubRequests();
  signInAndVisit(teamUrl);

  andThen(clickInvitesTab);

  andThen(() => {
    invites.forEach((invite) => {
      debugger;
      assert.ok(find(`td strong:contains(${invite.email})`).length, 'has invite');
    });
  });
});

skip('Security officer is checked');
skip('Privacy officer is checked');
skip('Setting new security officer');
skip('Setting new privacy officer');
skip('Existing developers are checked');
skip('Inviting new users modal');
skip('Clicking continue saves team attestation');

function clickInvitesTab() {
  let tab = findWithAssert('a:contains(Pending Invitations)');
  tab.click();
}

function stubRequests() {
  stubValidOrganization();

  stubRequest('get', `/roles/${developerRoleId}/users`, function() {
    return this.success({ _embedded: { users: [users[1]] }});
  });

  stubRequest('get', rolesHref, function(request) {
    return this.success({ _embedded: { roles } });
  });

  stubRequest('get', usersHref, function(request) {
    return this.success({ _embedded: { users }});
  });

  stubRequest('get', invitationsHref, function(request) {
    return this.success({ _embedded: { invitations }});
  });

  stubRequest('get', securityOfficerHref, function(request) {
    return this.success(users[2]);
  });

  stubRequest('get', '/permissions', function(request) {
    return this.success({ _embedded: { permissions }});
  });

  stubRequest('get', '/criteria', function(request) {
    return this.success({ _embedded: { criteria }});
  });
}
