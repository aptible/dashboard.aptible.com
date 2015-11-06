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

    assert.equal(find('.user-count').text(), users.length, 'user count badge is correct');
  });
});

test('Invitations tab shows all pending invitations', function(assert) {
  stubProfile({ currentStep: 'team' });
  stubRequests();
  signInAndVisit(teamUrl);

  andThen(clickInvitesTab);

  andThen(() => {
    invitations.forEach((invite) => {
      assert.ok(find(`td strong:contains(${invite.email})`).length, 'has invite');
    });

    assert.equal(find('td:contains(November 3, 2015)').length, 2, 'shows invited date');
    assert.equal(find('td:contains(Basic Role)').length, 2, 'shows role name');
    assert.equal(find('.invitation-count').text(), invitations.length, 'invitation count badge is correct');
  });
});

test('Toggling user roles and clicking continue saves team attestation with correct values', function(assert) {
  expect(4);
  let expectedAttestation = {
    handle: 'team',
    document: [
      {
        email: 'basicuser@asdf.com',
        name: 'Basic User',
        isDeveloper: true,
        isPrivacyOfficer: false,
        isSecurityOfficer: true,
        href: `/users/${userId}`,
      },
      {
        email: 'developeruser@asdf.com',
        name: 'Developer User',
        isDeveloper: false,
        isPrivacyOfficer: false,
        isSecurityOfficer: false,
        href: `/users/${developerId}`,
      },
      {
        email: 'securityofficeruser@asdf.com',
        name: 'Security Officer User',
        isDeveloper: false,
        isPrivacyOfficer: true,
        isSecurityOfficer: false,
        href: `/users/${securityOfficerId}`,
      }
    ]
  };

  stubProfile({ currentStep: 'team' });
  stubRequests();
  signInAndVisit(teamUrl);

  stubRequest('post', '/attestations', function(request) {
    let json = this.json(request);

    assert.ok(true, 'posts to create attestation');
    assert.deepEqual(json, expectedAttestation, 'correct attestation payload');

    return this.success({ id: 1 });
  });

  stubRequest('put', `/organization_profiles/${orgId}`, function(request) {
    let json = this.json(request);
    json.id = orgId;

    assert.ok(true, 'updates organization profile');
    assert.equal(json.current_step, 'data-environments');

    return this.success(json);
  });

  andThen(() => {
    findWithAssert('.toggle-developer:first label').click();
    findWithAssert('.toggle-security-officer:first label').click();
    findWithAssert('.toggle-privacy-officer:last label').click();
  });

  andThen(clickContinueButton);

});

// We can ship without these
skip('Inviting new users modal');
skip('Clicking continue saves team attestation');
skip('Clicking re-invite button sends new invitation');
skip('Clicking X button deletes pending invitation');
skip('Clicking X button removes user from organization');

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
}
