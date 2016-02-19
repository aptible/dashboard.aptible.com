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
    assert.equal(currentPath(), 'organization.setup.organization', 'redirected to organization step');
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
    find('.spd-back-button').click();
  });

  andThen(() => {
    assert.equal(currentPath(), 'organization.setup.locations.index', 'returned to locations step');
  });
});

test('Team shows all organization users', function(assert) {
  stubCurrentAttestations({ workforce_roles: [], workforce_locations: [] });
  stubProfile({ currentStep: 'team' });
  stubRequests();
  signInAndVisit(teamUrl);

  andThen(() => {
    users.forEach((user) => {
      assert.ok(find(`td strong:contains(${user.name})`).length, 'has user');
    });
  });
});

test('Shows all pending invitations', function(assert) {
  stubCurrentAttestations({ workforce_roles: [], workforce_locations: [] });
  stubProfile({ currentStep: 'team' });
  stubRequests();
  signInAndVisit(teamUrl);

  andThen(() => {
    invitations.forEach((invite) => {
      assert.ok(find(`td:contains(${invite.email})`).length, 'has invite row');
    });
  });
});

test('Toggling user roles and clicking continue saves team attestation with correct values', function(assert) {
  expect(4);
  stubCurrentAttestations({ workforce_roles: [], workforce_locations: [] });
  let expectedAttestation = {
    handle: 'workforce_roles',
    organization_url: `/organizations/${orgId}`,
    organization: `/organizations/${orgId}`,
    id: '0',
    schema_id: 'workforce_roles/1',
    document: [
      {
        email: 'basicuser@asdf.com',
        name: 'Basic User',
        hasAptibleAccount: true,
        isDeveloper: true,
        isRobot: false,
        isSecurityOfficer: true,
        href: `/users/${userId}`,
      },
      {
        email: 'developeruser@asdf.com',
        name: 'Developer User',
        hasAptibleAccount: true,
        isDeveloper: false,
        isRobot: false,
        isSecurityOfficer: false,
        href: `/users/${developerId}`,
      },
      {
        email: 'securityofficeruser@asdf.com',
        name: 'Security Officer User',
        hasAptibleAccount: true,
        isDeveloper: false,
        isRobot: false,
        isSecurityOfficer: false,
        href: `/users/${securityOfficerId}`,
      },
      {
        email: "newuser1@aptible.com",
        hasAptibleAccount: false,
        isDeveloper: false,
        isRobot: false,
        isSecurityOfficer: false
      },
      {
        email: "newuser2@aptible.com",
        hasAptibleAccount: false,
        isDeveloper: false,
        isRobot: true,
        isSecurityOfficer: false
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
    findWithAssert('.toggle-robot:last label').click();
  });

  andThen(clickContinueButton);
});

test('Pending invitations are included in attestation payload', function(assert) {
  expect(17);
  stubCurrentAttestations({ workforce_roles: [], workforce_locations: [] });
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

  let expectedAttestation = {
    handle: 'workforce_roles',
    organization_url: `/organizations/${orgId}`,
    organization: `/organizations/${orgId}`,
    id: '0',
    schema_id: 'workforce_roles/1',
    document: [
      {
        email: 'basicuser@asdf.com',
        name: 'Basic User',
        hasAptibleAccount: true,
        isDeveloper: true,
        isRobot: false,
        isSecurityOfficer: true,
        href: `/users/${userId}`,
      },
      {
        email: 'developeruser@asdf.com',
        name: 'Developer User',
        hasAptibleAccount: true,
        isDeveloper: false,
        isRobot: false,
        isSecurityOfficer: false,
        href: `/users/${developerId}`,
      },
      {
        email: 'securityofficeruser@asdf.com',
        name: 'Security Officer User',
        hasAptibleAccount: true,
        isDeveloper: false,
        isRobot: false,
        isSecurityOfficer: false,
        href: `/users/${securityOfficerId}`,
      },
      {
        email: "newuser1@aptible.com",
        hasAptibleAccount: false,
        isDeveloper: false,
        isRobot: false,
        isSecurityOfficer: false
      },
      {
        email: "newuser2@aptible.com",
        hasAptibleAccount: false,
        isDeveloper: false,
        isRobot: false,
        isSecurityOfficer: false
      },
      {
        email: 'skylar+1@aptible.com',
        hasAptibleAccount: false,
        isDeveloper: false,
        isRobot: false,
        isSecurityOfficer: false
      },
      {
        email: 'skylar+2@aptible.com',
        hasAptibleAccount: false,
        isDeveloper: false,
        isRobot: false,
        isSecurityOfficer: false
      },
      {
        email: 'skylar+3@aptible.com',
        hasAptibleAccount: false,
        isDeveloper: false,
        isRobot: false,
        isSecurityOfficer: false
      },
      {
        email: 'skylar+4@aptible.com',
        hasAptibleAccount: false,
        isDeveloper: false,
        isRobot: true,
        isSecurityOfficer: false
      }
    ]
  };

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
    findWithAssert('.toggle-robot:last label').click();
  });

  andThen(clickContinueButton);
});

test('Team page with existing team attestation', function(assert) {
  expect(13);
  let currentTeamAttestation = [
    {
      email: 'basicuser@asdf.com',
      name: 'Basic User',
      isDeveloper: false,
      isRobot: false,
      isSecurityOfficer: false,
      href: `/users/${userId}`,
    },
    {
      email: 'developeruser@asdf.com',
      name: 'Developer User',
      isDeveloper: true,
      isRobot: false,
      isSecurityOfficer: false,
      href: `/users/${developerId}`,
    },
    {
      email: 'securityofficeruser@asdf.com',
      name: 'Security Officer User',
      isDeveloper: false,
      isRobot: true,
      isSecurityOfficer: true,
      href: `/users/${securityOfficerId}`,
    }
  ];

  stubCurrentAttestations({ workforce_roles: currentTeamAttestation, workforce_locations: [] });
  let expectedAttestation = {
    handle: 'workforce_roles',
    id: '0',
    schema_id: 'workforce_roles/1',
    organization: `/organizations/${orgId}`,
    organization_url: `/organizations/${orgId}`,
    document: [
      {
        email: 'basicuser@asdf.com',
        name: 'Basic User',
        hasAptibleAccount: true,
        isDeveloper: true,
        isRobot: false,
        isSecurityOfficer: true,
        href: `/users/${userId}`,
      },
      {
        email: 'developeruser@asdf.com',
        name: 'Developer User',
        hasAptibleAccount: true,
        isDeveloper: false,
        isRobot: false,
        isSecurityOfficer: false,
        href: `/users/${developerId}`,
      },
      {
        email: 'securityofficeruser@asdf.com',
        name: 'Security Officer User',
        hasAptibleAccount: true,
        isDeveloper: true,
        isRobot: true,
        isSecurityOfficer: true,
        href: `/users/${securityOfficerId}`,
      },
      {
        email: "newuser1@aptible.com",
        hasAptibleAccount: false,
        isDeveloper: false,
        isRobot: false,
        isSecurityOfficer: false
      },
      {
        email: "newuser2@aptible.com",
        hasAptibleAccount: false,
        isDeveloper: false,
        isRobot: false,
        isSecurityOfficer: false
      }
    ]
  };

  stubProfile({ currentStep: 'team' });
  stubRequests();

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

  signInAndVisit(teamUrl);

  andThen(() => {
    // Existing attestation is use to render toggles in correct state

    currentTeamAttestation.forEach((user, index) => {
      let row = findWithAssert('table tbody tr')[index];

      let developerToggle = find('.toggle-developer input.x-toggle', row);
      let soToggle = find('.toggle-security-officer input.x-toggle', row);
      let robotToggle = find('.toggle-robot input.x-toggle', row);

      assert.equal(developerToggle.is(':checked'), user.isDeveloper, 'is developer is checked');
      assert.equal(soToggle.is(':checked'), user.isSecurityOfficer, 'security officer is checked');
      assert.equal(robotToggle.is(':checked'), user.isRobot, 'robot is checked');
    });
  });

  andThen(() => {
    // Change toggle values

    // Basic user changes
    findWithAssert('.toggle-developer label')[0].click();
    findWithAssert('.toggle-security-officer label')[0].click();

    // Developer user changes
    findWithAssert('.toggle-developer label')[1].click();

    // Security user changes
    findWithAssert('.toggle-developer label')[2].click();
  });

  // Continue to save and inspect assertions
  andThen(clickContinueButton);
});

test('Invite new member modal basic UI', function(assert) {
  stubCurrentAttestations({ workforce_roles: [], workforce_locations: [] });
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
  stubCurrentAttestations({ workforce_roles: [], workforce_locations: [] });
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

  andThen(() => {
    assert.equal(find('td:contains(skylar+1@aptible.com)').length, 1, 'has new invite');
    assert.equal(find('td:contains(skylar+2@aptible.com)').length, 1, 'has new invite');
    assert.equal(find('td:contains(skylar+3@aptible.com)').length, 1, 'has new invite');
    assert.equal(find('td:contains(skylar+4@aptible.com)').length, 1, 'has new invite');
  });
});

test('Developer and Security Officer groups are validated to include at least on user each', function(assert) {
  expect(2);
  stubCurrentAttestations({ workforce_roles: [], workforce_locations: [] });
  stubProfile({ currentStep: 'team' });
  stubRequests();
  signInAndVisit(teamUrl);

  stubRequest('post', '/attestations', function(request) {
    assert.ok(false, 'does not save an attestation');
    return this.success({ id: 1 });
  });

  andThen(clickContinueButton);
  andThen(() => {
    assert.ok(find('.alert-danger:contains(at least one Developer is required, at least one Security Officer is required.)').length === 1, 'shows an error');
    assert.equal(currentPath(), 'organization.setup.team.index', 'remains on team step');
  });
});

test('Clicking re-invite button sends new invitation', function(assert) {
  expect(2);
  stubCurrentAttestations({ workforce_roles: [], workforce_locations: [] });
  stubProfile({ currentStep: 'team' });
  stubRequests();
  stubRequest('post', '/resets', function(request) {
    assert.ok(true, 'posts a reset for the invitation');
    return this.success();
  });

  signInAndVisit(teamUrl);

  andThen(() => {
    let refreshBtn = findWithAssert('.two-actions:first .fa-refresh');
    refreshBtn.click();
  });

  andThen(() => {
    assert.ok(find('.alert-success'));
  });
});


test('Clicking X button deletes pending invitation', function(assert) {
  expect(3);
  stubCurrentAttestations({ workforce_roles: [], workforce_locations: [] });
  stubProfile({ currentStep: 'team' });
  stubRequests();
  stubRequest('delete', `/invitations/${invitations[0].id}`, function(request) {
    assert.ok(true, 'deletes the invitation');
    return this.noContent();
  });

  signInAndVisit(teamUrl);

  andThen(() => {
    // Clobber window confirm to accept delete.
    window.confirm = () => { return true; };
    let refreshBtn = findWithAssert('.two-actions:first .danger');
    refreshBtn.click();
  });

  andThen(() => {
    assert.ok(find('.alert-success'));
    assert.equal(find('.two-actions').length, 1, 'removes the deleted row');
  });
});


// Not sure if we ever want to do this here?
skip('Clicking X button removes user from organization');

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
  stubSchemasAPI();

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
