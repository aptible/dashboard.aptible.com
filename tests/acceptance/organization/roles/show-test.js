import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import { stubRequest } from 'diesel/tests/helpers/fake-server';

let application;
let orgId = 'o1'; // FIXME this is hardcoded to match the value for signIn in aptible-helpers
let roleId = 'r1';
let roleName = 'the-role';
let url = `/organizations/${orgId}/roles/${roleId}`;
let apiRoleUrl = `/roles/${roleId}`;
let apiRoleUsersUrl = `/roles/${roleId}/users`;
let apiUsersUrl = `/organizations/${orgId}/users`;

module('Acceptance: Organizations: Roles Show', {
  beforeEach: function() {
    application = startApp();
    stubOrganizations();
    stubStacks();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test(`visiting ${url} requires authentication`, () => {
  expectRequiresAuthentication(url);
});

let orgUrl = `/organizations/${orgId}`;
let apiOrgUsersUrl = `/organizations/${orgId}/users`;
function doSetup(options={}){
  let roleData = options.roleData || {id: roleId, name: roleName};
  let orgData = {
    id: orgId,
    _links: {
      self: { href: orgUrl },
      users: { href: apiOrgUsersUrl }
    }
  };
  let currentUserRoleData = options.currentUserRoleData || roleData;

  stubRequest('get', '/organizations', function() {
    return this.success({ _embedded: [orgData]});
  });
  stubOrganization(orgData);

  stubRequest('get', `/roles/${roleData.id}`, function() {
    return this.success(roleData);
  });

  // stacks links.organization is /oranizations/o1, but role is to /organizations/1
  stubStacks({}, options.stacks || []);
  stubRequest('get', apiOrgUsersUrl, function(){
    return this.success({ _embedded: {users: options.users || []} });
  });
  // This stubs out the roles URL, and since the roleId
  // matches that in the visited URL the data from this
  // index response is used.
  signIn(null, currentUserRoleData);
}

test(`visiting ${url} shows role edit fields`, (assert)=> {
  doSetup();
  visit(url);
  andThen(() => {
    const nameInput = findInput('role-name');
    assert.equal(nameInput.val(), roleName, 'Role name is in the input');

    const adminInput = findInput('role-admin');
    assert.ok(adminInput.is(':checked'), 'role is privileged');
  });
});

test(`visiting ${url} lists permissions by stack`, (assert)=> {
  let stackHandle = 'stack1-handle';
  let scopes = ['Read', 'Manage'];
  let stackId = 'stack1';
  let stacks = [{
    id: stackId,
    handle: stackHandle,
    _links: {
      organization: { href: orgUrl }
    }
  }];
  doSetup({
    currentUserRoleData: {
      id: 'admin-role-1',
      privileged: true,
      name: 'admin role',
      _links: {
        self: { href: '/role/admin-role-1' },
        organization: { href: '/organizations/o1' }
      }
    },
    roleData: {
      id: roleId,
      privileged: false,
      name: roleName,
      _links: { self: { href: apiRoleUrl } }
    },
    stacks: stacks
  });

  let postedPermission;
  let createPermissionUrl = `/accounts/${stackId}/permissions`;
  stubRequest('post', createPermissionUrl, function(request){
    postedPermission = true;
    const body = this.json(request);

    // the first checkbox is 'read' scope, hardcoded by the template
    assert.equal(body.scope, 'read', `posts with scope read`);
    assert.equal(body.role, apiRoleUrl, `posts with role url`);
    return this.success({ _links: { role: { href: apiRoleUrl }}});
  });

  visit(url);

  andThen(() => {
    assert.ok(find(`:contains(${stackHandle})`).length,
              'has stack handle');

    scopes.forEach((s) => {
      assert.ok(find(`:contains(${s})`).length,
                `has "${s}" scope`);
    });

    assert.equal(find(`input.permission-checkbox:not(:checked)`).length, scopes.length*stacks.length,
                 'has an unchecked checkbox for each scope');
  });
  click(`input.permission-checkbox:eq(0)`);
  andThen(() => {
    assert.ok(!postedPermission, 'did not hit server yet');

    clickButton('Update Role');
  });
  andThen(() => {
    assert.ok(postedPermission, 'posts to server');
  });
});

test(`visiting ${url} lists permissions by stack, checked boxes when permissions are present`, (assert)=> {
  let roleData = {
    id: roleId,
    privileged: false,
    name: roleName
  };

  let scopes = ['Read', 'Manage'];
  let permissions = [{
    id: 'p1',
    scope: 'read',
    _links: { role: { href: apiRoleUrl }, }
  }, {
    id: 'p2',
    scope: 'manage',
    _links: { role: { href: apiRoleUrl }, }
  }];

  let stackId = 'stack1';
  let stacks = [{
    id: stackId,
    handle: 'stack1-handle',
    _links: { organization: { href: orgUrl }, },
    _embedded: { permissions }
  }];

  doSetup({roleData, stacks});

  let deletedPermission;
  let expectedPermissionId = permissions[0].id;
  let deletePermissionUrl  = `/permissions/${expectedPermissionId}`;
  stubRequest('delete', deletePermissionUrl, function(){
    deletedPermission = true;
    return this.noContent();
  });

  visit(url);

  andThen(() => {
    stacks.forEach((stack) => {
      assert.ok(find(`:contains(${stack.handle})`).length,
                `has stack handle "${stack.handle}`);
    });

    scopes.forEach((s) => {
      assert.ok(find(`:contains(${s})`).length,
                `has "${s}" scope`);
    });

    assert.equal(find(`input.permission-checkbox:checked`).length, scopes.length*stacks.length,
                 'has a checked checkbox for each scope');
  });
  click(`input.permission-checkbox:eq(0)`);
  andThen(() => {
    assert.ok(!deletedPermission, 'did not hit server yet');

    clickButton('Update Role');
  });
  andThen(() => {
    assert.ok(deletedPermission, 'deletes to server');
  });
});

test(`visiting ${url} saves changed name and privileged values`, (assert)=> {
  assert.expect(2);
  doSetup();

  const changedName = 'Kim Kelly';

  stubRequest('put', `/roles/${roleId}`, function(request) {
    const body = this.json(request);
    assert.equal(body.name, changedName, 'name is saved');
    assert.equal(body.privileged, false, 'privileged state is saved');
    return this.noContent();
  });

  visit(url);
  fillInput('role-name', changedName);
  // Should uncheck the admin role
  click('input[name=role-admin]');
  clickButton('Update Role');
});

test(`visiting ${url} show error for failuere to save changed name`, (assert)=> {
  assert.expect(1);
  doSetup();

  stubRequest('put', `/roles/${roleId}`, function() {
    return this.error({
      code: 422,
      error: 'unprocessable_entity',
      message: 'Name is not valid'
    });
  });

  visit(url);
  fillInput('role-name', '');
  clickButton('Update Role');
  andThen(() => {
    const error = find(':contains(There was an error)');
    assert.ok(error.length, 'Errors are on the page');
  });
});

test(`visiting ${url} shows list of members`, (assert) => {

  const memberUser = {
    id: 'org-user-1',
    name: 'bob'
  };
  const orgUser = {
    id: 'org-user-2',
    name: 'mr anderson'
  };
  const orgUsers = [
    memberUser,
    orgUser
  ];

  doSetup({
    roleData: {
      id: roleId,
      name: roleName,
      _links: {
        users: { href: apiRoleUsersUrl }
      }
    },
    users: orgUsers
  });

  stubRequest('get', apiRoleUsersUrl, function(){
    return this.success({ _embedded: {users: [memberUser]} });
  });

  visit(url);
  andThen(() => {
    let membersDiv = findWithAssert('.role-members');
    assert.ok(membersDiv.find(`:contains(${memberUser.name})`).length,
              `member list has div with user name "${memberUser.name}"`);
    assert.ok(!membersDiv.find(`:contains(${orgUser.name})`).length,
              `member list does not have div with user name "${orgUser.name}"`);
    let nonmemberSelect = findWithAssert('.user-select');
    assert.ok(nonmemberSelect.find(`:contains(${orgUser.name})`).length,
              `nonmember select has option with user name "${orgUser.name}"`);
    assert.ok(!nonmemberSelect.find(`:contains(${memberUser.name})`).length,
              `nonmember select does not have option with user name "${memberUser.name}"`);
  });
});

test(`visiting ${url} allows removing a user`, (assert) => {
  assert.expect(1);

  let apiRoleMembersUrl = `/roles/${roleId}/memberships`;
  let roleData = {
    id: roleId,
    name: roleName,
    _links: {
      memberships: { href: apiRoleMembersUrl },
      users: { href: apiRoleUsersUrl }
    }
  };

  doSetup({roleData});

  const orgUserId =  'org-user-1';
  let orgUserUrl = `/users/${orgUserId}`;
  const users = [{
    id: orgUserId,
    name: 'bob',
    _links: { self: {href: orgUserUrl} }
  }];

  const memberships = [{
    id: 'membership1',
    _links: { user: { href: orgUserUrl } }
  }, {
    id: 'membership2',
    _links: { user: { href: `/users/some-other-user` } }
  }];

  stubRequest('get', apiRoleMembersUrl, function(){
    return this.success({ _embedded: {memberships} });
  });

  stubRequest('get', apiRoleUsersUrl, function(){
    return this.success({ _embedded: {users} });
  });

  // returns a list of users
  stubRequest('get', apiUsersUrl, function(){
    return this.success({ _embedded: {users} });
  });

  stubRequest('get', apiRoleUrl, function(){
    return this.success(roleData);
  });

  stubRequest('delete', `/memberships/${memberships[0].id}`, function(){
    assert.ok(true, `DELETEs membership id "${memberships[0].id}`);
    return this.noContent();
  });

  visit(url);
  andThen(() => {
    let firstButton = findWithAssert('.role-members button:contains(Remove):eq(0)');
    click(firstButton);
  });
});

test(`visiting ${url} shows invitation UI`, (assert) => {
  const invitations = [{
    id: 'invite1',
    email: 'user1@gmail.com'
  }, {
    id: 'invite2',
    email: 'user2@gmail.com'
  }];

  const roleData = {
    id: roleId,
    name: roleName,
    _embedded: { invitations }
  };

  doSetup({roleData});

  visit(url);
  andThen(() => {
    expectInput('invite-by-email');
    expectButton('Invite');

    // lists invitations, with resend/remove buttons
    let invitationsDiv = findWithAssert('.role-invitations');

    invitations.forEach((invite, index) => {
      assert.ok(invitationsDiv.find(`:contains(${invite.email})`).length,
                `shows invite for email "${invite.email}"`);

      assert.ok(invitationsDiv.find(`.role-invite:eq(${index}) button:contains(Resend)`).length,
                `has invitation resend button for item @ index ${index}`);

      assert.ok(invitationsDiv.find(`.role-invite:eq(${index}) button:contains(Remove)`).length,
                `has invitation remove button for item @ index ${index}`);
    });
  });
});

test(`visiting ${url} allows inviting a user by email`, (assert) => {
  assert.expect(1);

  const email = 'abc@gmail.com';

  stubRequest('post', `/roles/${roleId}/invitations`, function(request){
    assert.equal(this.json(request).email, email, 'creates invite with email');
    return this.noContent();
  });

  doSetup();
  visit(url);
  fillInput('invite-by-email', email);
  clickButton('Invite');
});

test(`visiting ${url} shows error when inviting a user by email`, (assert) => {
  assert.expect(1);

  const email = 'abc@gmail.com';

  stubRequest('post', `/roles/${roleId}/invitations`, function(){
    return this.error({
      code: 422,
      error: 'unprocessable_entity',
      message: 'Email is not valid'
    });
  });

  doSetup();
  visit(url);
  fillInput('invite-by-email', email);
  clickButton('Invite');
  andThen(() => {
    const error = find(':contains(There was an error)');
    assert.ok(error.length, 'Errors are on the page');
  });
});

test(`visiting ${url} allows removing an invitation`, (assert) => {
  const invitations = [{
    id: 'invite1',
    email: 'user1@gmail.com'
  }, {
    id: 'invite2',
    email: 'user2@gmail.com'
  }];

  const roleData = {
    id: roleId,
    name: roleName,
    _embedded: { invitations }
  };

  doSetup({roleData});

  stubRequest('delete', `/invitations/${invitations[0].id}`, function(){
    assert.ok(true, 'DELETEs invitation');
    return this.noContent();
  });

  visit(url);
  click(`.role-invitations button:contains(Remove):eq(0)`);
});

test(`visiting ${url} allows resending an invitation`, (assert) => {
  const invitations = [{
    id: 'invite1',
    email: 'user1@gmail.com'
  }, {
    id: 'invite2',
    email: 'user2@gmail.com'
  }];

  const roleData = {
    id: roleId,
    name: roleName,
    _embedded: { invitations }
  };

  doSetup({roleData});

  stubRequest('post', `/resets`, function(request){
    let json = this.json(request);
    assert.equal(json.type, 'invitation', 'has type invitation');
    assert.equal(json.invitation_id, invitations[0].id, 'has invitation_id param');
    return this.noContent();
  });

  visit(url);
  click(`.role-invitations button:contains(Resend):eq(0)`);
});
