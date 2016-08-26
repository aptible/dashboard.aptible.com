import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref, securityOfficerId,
         securityOfficerHref } from '../../helpers/organization-stub';

let application;
let userId = 'basic-user-1';
let developerId = 'developer-user-2';
let trainingOnlyRoleId = 'training-only-role-1';
let developerRoleId = 'developer-role-2';
let platformOwnerId = 'platform-owner-role-3';
let complianceOwnerId = 'compliance-owner-role-4';

let adminRoleId = 'admin-role-3';

let settingsTeamUrl = `/gridiron/${orgId}/admin/settings/team`;
let setupTeamUrl = `/gridiron/${orgId}/admin/setup/team`;

let users = [
  {
    id: userId,
    name: 'Training Sarah',
    email: 'basicuser@asdf.com',
    _links: {
      self: { href: `/users/${userId}` }
    }
  },
  {
    id: developerId,
    name: 'Training Steve',
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

let memberships = [
  {
    id: 1,
    _links: {
      self: { href: 'memberships/1' },
      role: { href: `/roles/${trainingOnlyRoleId}` },
      user: { href: `/users/${users[0].id}`}
    }
  },
  {
    id: 2,
    _links: {
      self: { href: 'memberships/2' },
      role: { href: `/roles/${trainingOnlyRoleId}` },
      user: { href: `/users/${users[1].id}`}
    }
  },
  {
    id: 3,
    _links: {
      self: { href: 'memberships/3' },
      role: { href: `/roles/${complianceOwnerId}` },
      user: { href: `/users/${users[2].id}`}
    }
  }
];

let roles = [
  {
    id: trainingOnlyRoleId,
    type: 'compliance_user',
    name: 'Training-Only Users',
    _links: {
      self: { href: `/roles/${trainingOnlyRoleId}` },
      users: { href: `/roles/${trainingOnlyRoleId}/users`},
      memberships: { href: `/roles/${trainingOnlyRoleId}/memberships`}
    }
  },
  {
    id: developerRoleId,
    type: 'compliance_user',
    name: 'Developer Training Role',
    _links: {
      self: { href: `/roles/${developerRoleId}` },
      users: { href: `/roles/${developerRoleId}/users`},
      memberships: { href: `/roles/${developerRoleId}/memberships`}
    }
  },
  {
    id: adminRoleId,
    type: 'owner',
    name: 'Admin Role',
    _links: {
      self: { href: `/roles/${platformOwnerId}` },
      users: { href: `/roles/${platformOwnerId}/users`},
      memberships: { href: `/roles/${platformOwnerId}/memberships`}
    }
  },
  {
    id: complianceOwnerId,
    type: 'compliance_owner',
    name: 'Compliance Owners',
    _links: {
      self: { href: `/roles/${complianceOwnerId}` },
      users: { href: `/roles/${complianceOwnerId}/users`},
      memberships: { href: `/roles/${complianceOwnerId}/memberships`},
    }
  }
];

let invitations = [
  {
    id: 'invite-1',
    role_id: trainingOnlyRoleId,
    inviter_id: users[0].id,
    email: 'newuser1@aptible.com',
    created_at: '2015-11-03T20:34:06.963Z',
    _links: {
      role: {
        href: `/roles/${trainingOnlyRoleId}`
      }
    }
  },
  {
    id: 'invite-2',
    role_id: trainingOnlyRoleId,
    inviter_id: users[0].id,
    email: 'newuser2@aptible.com',
    created_at: '2015-11-03T20:34:06.963Z',
    _links: {
      role: {
        href: `/roles/${trainingOnlyRoleId}`
      }
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
  },
  {
    id: '2',
    scope: 'read',
    _links: {
      role: { href: `/roles/${trainingOnlyRoleId}` }
    }
  }
];

module('Acceptance: Security Program Settings/Security Program Setup: Team', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});


test('Settings Team settings basic UI', function(assert) {
  stubRequests();
  stubAllRoles();
  signInAndVisit(settingsTeamUrl);
  testBasicUI(assert);
});

test('Setup Team settings basic UI', function(assert) {
  stubRequests();
  stubAllRoles();
  signInAndVisit(setupTeamUrl);
  testBasicUI(assert);
});

test('Settings Clicking `X` next to users will remove their membership', function(assert) {
  expect(3);
  stubRequests();
  stubAllRoles();
  signInAndVisit(settingsTeamUrl);
  testRemoveUser(assert);
});

test('Setup Clicking `X` next to users will remove their membership', function(assert) {
  expect(3);
  stubRequests();
  stubAllRoles();
  signInAndVisit(setupTeamUrl);
  testRemoveUser(assert);
});

test('Settings Clicking `X` next to invites will remove invitation', function(assert) {
  expect(4);
  stubRequests();
  stubAllRoles();
  signInAndVisit(settingsTeamUrl);
  testRemoveInvitation(assert);
});

test('Setup Clicking `X` next to invites will remove invitation', function(assert) {
  expect(4);
  stubRequests();
  stubAllRoles();
  signInAndVisit(setupTeamUrl);
  testRemoveInvitation(assert);
});

test('Settings clicking refresh next to invites will resend invitation', function(assert) {
  expect(4);
  stubRequests();
  stubAllRoles();
  signInAndVisit(settingsTeamUrl);
  testResendInvitation(assert);
});

test('Setup clicking refresh next to invites will resend invitation', function(assert) {
  expect(4);
  stubRequests();
  stubAllRoles();
  signInAndVisit(setupTeamUrl);
  testResendInvitation(assert);
});

test('Settings Inviting users if a role doesn\'t exist will create role', function(assert) {
  expect(8);
  stubPartialRoles();
  stubRequests({ invitations: [] });
  signInAndVisit(settingsTeamUrl);
  testFindOrCreateRole(assert);
});

test('Setup Inviting users if a role doesn\'t exist will create role', function(assert) {
  expect(8);
  stubPartialRoles();
  stubRequests({ invitations: [] });
  signInAndVisit(setupTeamUrl);
  testFindOrCreateRole(assert);
});


function testBasicUI(assert) {
  andThen(() => {
    // Shows 2 role panels: Training Only, Compliance Owners
    let trainingPanel = findWithAssert('.workforce-role:contains(Training-Only Users)');
    let adminPanel = findWithAssert('.workforce-role:contains(Compliance Owners)');

    assert.equal(trainingPanel.length, 1, 'shows training only role');
    assert.equal(adminPanel.length, 1, 'shows compliance admin role');

    // Training only has 2 users and 2 invites
    assert.equal(trainingPanel.find('.workforce-role__user').length, 2, 'training role has correct user count');
    assert.equal(trainingPanel.find('.workforce-role__invitation').length, 2, 'training role has correct invite count');

    let trainingUsers = trainingPanel.find('.workforce-role__user .workforce-role__user-name');
    assert.equal(trainingUsers.text().replace(/\W/ig,''), 'TrainingSarahTrainingSteve', 'training role has correct users');

    let trainingInvites = trainingPanel.find('.workforce-role__invitation .workforce-role__user-name');
    assert.equal(trainingInvites.text().replace(/\W/ig, ''), 'newuser1aptiblecomnewuser2aptiblecom', 'training role has correct invites');

    // Compliance admin has 1 user and no invites
    assert.equal(adminPanel.find('.workforce-role__user').length, 1, 'admin role has correct number of users');
    assert.equal(adminPanel.find('.workforce-role__invitation').length, 0, 'admin role has correct number of invites');
  });
}

function testRemoveUser(assert) {
  window.confirm = function() {
    return true;
  };

  stubRequest('delete', '/memberships/1', function() {
    assert.ok(true, 'call to delete membership');
    return this.noContent();
  });

  andThen(() => {
    assert.equal(find('.workforce-role__user').length, 3, 'three users to start');

    let firstX = findWithAssert('.workforce-role__user .fa-times').first();
    firstX.click();
  });

  andThen(() => {
    assert.equal(find('.workforce-role__user').length, 2, 'a user is removed');
  });
}

function testRemoveInvitation(assert) {
  window.confirm = function() {
    assert.ok(true, 'confirms before removing invite');
    return true;
  };

  stubRequest('delete', '/invitations/invite-1', function() {
    assert.ok(true, 'call to delete invitation');
    return this.noContent();
  });

  andThen(() => {
    assert.equal(find('.workforce-role__invitation').length, 2, 'two invitations to start');

    let firstX = findWithAssert('.workforce-role__invitation .fa-times').first();
    firstX.click();
  });

  andThen(() => {
    assert.equal(find('.workforce-role__invitation').length, 1, 'an invitation is removed');
  });
}

function testResendInvitation(assert) {
  window.confirm = function() {
    assert.ok(true, 'confirms before removing invite');
    return true;
  };

  stubRequest('post', '/resets', function(request) {
    let json = this.json(request);
    assert.ok(true, 'posts to create reset');
    assert.equal(json.type, 'invitation');
    assert.equal(json.invitation_id, 'invite-1');

    json.id = 'reset-01';
    return this.success(json);
  });

  andThen(() => {
    assert.equal(find('.workforce-role__invitation').length, 2, 'two invitations to start');

    let firstRefresh = findWithAssert('.workforce-role__invitation .fa-refresh').first();
    firstRefresh.click();
  });
}

function testFindOrCreateRole(assert) {
  let newInviteEmail = 'test+user@example.com';
  stubRequest('post', rolesHref, function(request) {
    let json = this.json(request);

    assert.ok(true, 'posts to create new role');
    assert.equal(json.name, 'Training-Only Users', 'uses correct name');
    assert.equal(json.type, 'compliance_user', 'uses correct type');

    json.id = trainingOnlyRoleId;
    return this.success(json);
   });

  stubRequest('post', `/roles/${trainingOnlyRoleId}/invitations`, function(request) {
    let json = this.json(request);
    assert.ok(true, 'post to create invitation');
    assert.equal(json.email, newInviteEmail, 'invite has correct email');

    json.id = 'new-compliance-invite';

    return this.success(json);
  });

  andThen(function() {
    let adminPanel = findWithAssert('.workforce-role:contains(Training-Only Users)');
    let button = adminPanel.find('.invite-more-users');
    assert.equal(button.length, 1, 'shows invite new users button');

    button.click();
  });

  andThen(function() {
    Ember.run(() => {
      fillIn('textarea.email-addresses', newInviteEmail);
      let submitButton = findWithAssert('button.send-invites');
      submitButton.click();
    });
  });

  andThen(function() {
    let adminPanel = findWithAssert('.workforce-role:contains(Training-Only Users)');
    let adminInvites = adminPanel.find('.workforce-role__invitation .workforce-role__user-name');

    assert.equal(find('.lf-dialog').length, 0, 'dialog is closed');
    assert.equal(adminInvites.text().replace(/\W/ig, ''), newInviteEmail.replace(/\W/ig, ''), 'new invite renders');
  });
}

function stubPartialRoles() {
  stubRequest('get', rolesHref, function() {
    return this.success({ _embedded: { roles: [roles[3]] } });
  });

  stubRequest('get', `/roles/${complianceOwnerId}`, function() {
    return this.success(roles[2]);
  });

  stubRequest('get', `/roles/${complianceOwnerId}/users`, function() {
    return this.success({ _embedded: { users: [users[2]] }});
  });

  stubRequest('get', `/roles/${complianceOwnerId}/memberships`, function() {
    return this.success({ _embedded: { memberships: [memberships[2]] }});
  });
}

function stubAllRoles() {
  stubRequest('get', rolesHref, function() {
    return this.success({ _embedded: { roles } });
  });

  stubRequest('get', `/roles/${trainingOnlyRoleId}`, function() {
    return this.success(roles[0]);
  });

  stubRequest('get', `/roles/${trainingOnlyRoleId}/users`, function() {
    return this.success({ _embedded: { users: [users[0], users[1]] }});
  });

  stubRequest('get', `/roles/${trainingOnlyRoleId}/memberships`, function() {
    return this.success({ _embedded: { memberships: [memberships[0], memberships[1]] }});
  });

  stubRequest('get', `/roles/${complianceOwnerId}`, function() {
    return this.success(roles[2]);
  });

  stubRequest('get', `/roles/${complianceOwnerId}/users`, function() {
    return this.success({ _embedded: { users: [users[2]] }});
  });

  stubRequest('get', `/roles/${complianceOwnerId}/memberships`, function() {
    return this.success({ _embedded: { memberships: [memberships[2]] }});
  });
}

function stubRequests(options = {}) {
  if(options.invitations) {
    invitations = options.invitations;
  }
  stubValidOrganization(options);
  stubSchemasAPI();
  stubCurrentAttestations({ workforce_locations: [] });
  stubProfile({ hasCompletedSetup: true, currentStep: 'team' });
  stubCriterionDocuments({});
  stubStacks();
  stubBillingDetail();
  stubCriteria();

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
