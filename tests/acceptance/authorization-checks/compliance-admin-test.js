import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref,
         securityOfficerHref } from '../../helpers/organization-stub';

let application;
let userId = 'user1';
let roleIndexUrl = `/organizations/${orgId}/roles/compliance`;
let platformRoleUrl = `/organizations/${orgId}/roles/platform-role/members`;
let complianceRoleUrl = `/organizations/${orgId}/roles/compliance-role/members`;
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

let permissions = [
  {
    id: 2,
    scope: 'read',
    _links: {
      role: { href: '/roles/platform-role' }
    }
  }
];

let roles = [
  {
    name: 'owners',
    type: 'owner',
    _links: {
      organization: { href: `/organizations/${orgId}` }
    }
  },
  {
    id: 'platform-role',
    name: 'engineers',
    type: 'platform_user',
    _links: {
      organization: { href: `/organizations/${orgId}` }
    }
  },
  {
    id: 'compliance-role',
    name: 'training only',
    type: 'compliance_user',
    _links: {
      organization: { href: `/organizations/${orgId}` }
    }
  }
];

module('Acceptance: Authorization: Compliance Admin Feature Permissions', {
  beforeEach() {
    application = startApp();
    stubProfile({ hasCompletedSetup: true });
    stubCriterionDocuments({});
    stubCriteria();
    stubStacks({ permissions });
    stubRequest('get', '/documents', function() {
      return this.success({ _embedded: { documents: [] }});
    });
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
// Can view risk assessments
// Can view training
// Can view SPD
// Can edit SPD
// Cannot view Enclave
// Can view role index
// can view individual role
// cannot add user
});

test('Compliance owners should be able to create compliance roles, but not platform roles', function(assert) {
  assert.expect(7);
  stubRequests();
  signInAs('compliance_owner');
  visit(roleIndexUrl);

  stubRequest('post', `/organizations/${orgId}/roles`, function(request) {
    let json = this.json(request);
    assert.ok(true, 'creates new role');
    assert.equal(json.type, 'compliance_user');
    json.id = 'new-role-1';
    json._links = {
      organization: { href: `/organizations/${orgId}` }
    };
    return this.success(201, json);
  });

  andThen(() => {
    // Should see create role button
    let openRoleModal = find('.open-role-modal');
    assert.equal(openRoleModal.length, 1, 'shows create role button');
    openRoleModal.click();
  });

  andThen(() => {
    // Should not be able to select role type
    let typeOptions = find('.role-type-options');
    assert.equal(typeOptions.length, 0, 'unable to select type when creating role');

    fillInput('role-name', 'Marketing Team');
    clickButton('Save Role');
  });

  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.organization.role.members', 'redirected to role show page after create');
    assert.equal(find('.resource-navigation a:contains(Members)').length, 1, 'shows Members tab');
    assert.equal(find('.resource-navigation a:contains(Settings)').length, 1, 'shows Settings tab');
  });
});

test('Compliance Owners should be able to manage compliance roles settings', function(assert) {
  let newRoleName = 'renamed training only';

  assert.expect(8);
  stubRequests();
  signInAs('compliance_owner');
  visit(complianceRoleUrl);

  stubRequest('put', '/roles/compliance-role', function(request) {
    let json = this.json(request);
    assert.ok(true, 'role is updated');
    assert.equal(json.name, newRoleName, 'new name is used');
    json.id = 'compliance-role';
    return this.success(json);
  });

  andThen(() => {
    let settingsTab = find('.resource-navigation a:contains(Settings)');
    assert.equal(find('.resource-navigation a:contains(Members)').length, 1, 'shows Members tab');
    assert.equal(settingsTab.length, 1, 'shows Settings tab');
    settingsTab.eq(0).click();
  });

  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.organization.role.settings', 'remain on settings page');
    let nameInput = find('input[name="role-name"]');
    assert.equal(nameInput.val(), 'training only', 'input shows correct role');
    assert.equal(find('button:contains(Save Changes)').attr('disabled'), 'disabled', 'save button is disabled when name is unchanged');

    fillInput('role-name', newRoleName);
  });

  andThen(() => {
    assert.equal(!!find('button:contains(Save Changes)').attr('disabled'), false, 'save button is enabled once name is changed');
    clickButton('Save Changes');
  });
});

test('Compliance owners should be able to invite users to compliance roles', function(assert) {
  assert.expect(5);
  stubRequests();
  signInAs('compliance_owner');
  visit(complianceRoleUrl);

  let newInviteEmail = 'test@example.com';

  stubRequest('post', '/roles/compliance-role/memberships', function() {
    assert.ok(true, 'creates new membership');
    return this.success(201, { id: 'new-membership-1' });
  });

  stubRequest('post', 'roles/compliance-role/invitations', function(request) {
    let json = this.json(request);
    assert.ok(true, 'posts to create invitation');
    assert.equal(json.email, newInviteEmail, 'uses correct invite email');
    json.id = 1;
    return this.success(201, json);
  });

  andThen(() => {
    let userSelect = find('.invite-user .user-select-container select');
    let createInvite = find('.invite-user .invite-user-container');

    assert.equal(userSelect.length, 1, 'shows user select');
    assert.equal(createInvite.length, 1, 'shows createInvite');

    let userOption = userSelect.find('option').last();

    userOption.prop('selected', true);
    userSelect.trigger('change');

    clickButton('Add');
  });

  andThen(() => {
    fillInput('invite-by-email', newInviteEmail);
    clickButton('Send Invite');
  });
});

test('Compliance Owners should NOT be able to manage platform roles settings', function(assert) {
  stubRequests();
  signInAs('compliance_owner');
  visit(platformRoleUrl);

  andThen(() => {
    let settingsTab = find('.resource-navigation a:contains(Settings)');
    assert.equal(find('.resource-navigation a:contains(Members)').length, 1, 'shows Members tab');
    assert.equal(settingsTab.length, 0, 'does not show Settings tab');

    visit(`/organizations/${orgId}/roles/platform-role/settings`);
  });

  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.organization.role.members',
                'was redirected from platform role settings page to members page');
  });
});

test('Compliance owners should NOT be able to invite users to platform roles', function(assert) {
  stubRequests();
  signInAs('compliance_owner');
  visit(platformRoleUrl);

  andThen(() => {
    let userSelect = find('.invite-user .user-select-container select');
    let createInvite = find('.invite-user .invite-user-container');

    assert.equal(userSelect.length, 0, 'does not show user select');
    assert.equal(createInvite.length, 0, 'does not show createInvite');
  });
});

test('Compliance owners should NOT be able to alter environment permissions for', function(assert) {
  stubRequests();
  signInAs('compliance_owner');
  visit(platformRoleUrl);

  andThen(() => {
    clickButton('Environments');
  });

  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.organization.role.environments', 'remain on environments page');
    let stackPanel = findWithAssert('.stack-my-stack-1');
    assert.equal(stackPanel.find('.read-row .aptable__actions .fa-check.success').length, 1, 'shows green check and not a toggle');
    assert.equal(stackPanel.find('.manage-row .aptable__actions .fa-times.danger').length, 1, 'shows red &times; and not a toggle');
  });
});

function stubRequests() {
  stubValidOrganization();

  stubRequest('get', rolesHref, function() {
    return this.success({ _embedded: { roles }});
  });

  roles.forEach((role) => {
    stubRequest('get', `/roles/${role.id}`, function() {
      return this.success(role);
    });
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
}