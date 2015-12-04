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
let adminRoleId = 'admin-role-3';
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
  },
  {
    id: adminRoleId,
    privileged: true,
    name: 'Admin Role',
    _links: {
      self: { href: `/roles/${adminRoleId}` },
      users: { href: `/roles/${adminRoleId}/users`}
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

test('You are redirected to correct step if not ready for team step', function(assert) {
  stubProfile({ currentStep: 'organization' });
  stubRequests();
  signInAndVisit(teamUrl);

  andThen(() => {
    assert.equal(currentPath(), 'organization.setup.organization', 'redirected to organization step');
  });
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
    organization: `/organizations/${orgId}`,
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

test('Invite new member modal basic UI', function(assert) {
  stubProfile({ currentStep: 'team' });
  stubRequests();
  signInAndVisit(teamUrl);

  andThen(openInviteModal);

  andThen(() => {
    assert.equal(find('h1:contains(Invite your workforce)').length, 1, 'has a modal title');

    let roleSelect = find('select.select-role');

    // It should have a dropdown with roles
    assert.equal(roleSelect.length, 1, 'has a role select');
    assert.equal(roleSelect.find('option').length, 4, 'role select has 3 options');
    assert.ok(roleSelect.find('option:first').is(':disabled'), 'first option is disabled');
    assert.equal(roleSelect.find('option:contains((Admin) Admin Role)').length, 1, 'Admin roles have (Admin) prefix');

    // It should have a text area
    assert.equal(find('textarea.email-addresses').length, 1, 'has an email address text area');

    // It should have an Invite button and a Cancel button
    assert.equal(find('button.cancel-invites:contains(Cancel)').length, 1, 'has a cancel button');
    assert.equal(find('button.send-invites:contains(Invite)').length, 1, 'has an invite button');

    // Clicking cancel should close the dialog
    let cancelButton = find('button.cancel-invites');
    cancelButton.click();
  });

  andThen(() => {
    assert.equal(find('.lf-dialog').length, 0, 'dialog is closed');
  });
});

test('Invite modal creates invitation record for each email', function(assert) {
  expect(17);

  let emailAddresses = 'skylar+1@aptible.com;skylar+2@aptible.com\nskylar+3@aptible.com skylar+4@aptible.com';
  let roleId = basicRoleId;
  let id = 1;

  stubRequest('post', `/roles/${roleId}/invitations`, function(request) {
    let json = this.json(request);
    json.id = id++;

    assert.ok(true, 'creates invitation');
    assert.equal(json.role_id, roleId);
    assert.equal(json.organization_id, orgId);

    return this.success(json);
  });

  stubProfile({ currentStep: 'team' });
  stubRequests();
  signInAndVisit(teamUrl);

  andThen(openInviteModal);
  andThen(() => {
    selectRole(roleId);
    fillIn('textarea.email-addresses', emailAddresses);
  });

  andThen(() => {
    let submitButton = findWithAssert('button.send-invites');
    submitButton.click();
  });

  andThen(() => {
    assert.equal(find('.lf-dialog').length, 0, 'dialog is closed');
  });

  andThen(clickInvitesTab);

  andThen(() => {
    assert.equal(find('td:contains(skylar+1@aptible.com)').length, 1, 'has new invite');
    assert.equal(find('td:contains(skylar+2@aptible.com)').length, 1, 'has new invite');
    assert.equal(find('td:contains(skylar+3@aptible.com)').length, 1, 'has new invite');
    assert.equal(find('td:contains(skylar+4@aptible.com)').length, 1, 'has new invite');
  });
});

// We can ship without these
skip('Clicking re-invite button sends new invitation');
skip('Clicking X button deletes pending invitation');
skip('Clicking X button removes user from organization');

function clickInvitesTab() {
  let tab = findWithAssert('a:contains(Pending Invitations)');
  tab.click();
}

function openInviteModal() {
  let button = findWithAssert('button:contains(Invite more users)');
  button.click();
}

function selectRole(roleId) {
  let select = findWithAssert('select.select-role');
  select.val(basicRoleId);
  select.trigger('change');
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
