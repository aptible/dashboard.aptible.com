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
let url = `/organizations/${orgId}/roles/new`;
let apiRoleUrl = `/roles/${roleId}`;

const roleData = {
  id: roleId,
  name: 'the role name',
  _links: { self: { href: apiRoleUrl } }
};

module('Acceptance: Organizations: Roles: New', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

const apiOrgUrl = `/organizations/${orgId}`;
// must include link to org url so that the route
// can find these stacks for this organization
const stacks = [{
  id: 'stack1',
  handle: 'stack1-handle',
  activated: true,
  _links: { organization: {href: apiOrgUrl} }
}, {
  id: 'stack2',
  handle: 'stack2-handle',
  activated: true,
  _links: { organization: {href: apiOrgUrl} }
}];

function setup(){
  stubOrganization({id:orgId});
  stubStacks({}, stacks);
}

test(`visiting ${url} requires authentication`, () => {
  expectRequiresAuthentication(url);
});

test(`visiting ${url} shows form to create new role`, (assert) => {
  setup();
  signInAndVisit(url);
  andThen(() => {
    assert.equal(currentPath(), 'dashboard.organization.roles.new');
    expectButton('Save');
    expectButton('Cancel');
    expectFocusedInput('role-name');
    expectInput('role-admin');

    stacks.forEach((stack) => {
      let stackDiv = find(`.stacks :contains(${stack.handle})`);
      assert.ok(stackDiv.length,
                `has stack with handle "${stack.handle}"`);
    });
  });
});

test(`visiting ${url} and creating new role without permissions`, (assert) => {
  setup();

  const roleName = roleData.name;

  stubRequest('post', `/organizations/${orgId}/roles`, function(request){
    assert.ok(true, 'posts to /roles');
    let json = this.json(request);
    assert.equal(json.name, roleName, 'has role name');
    assert.ok(!!json.privileged, 'has admin value');
    return this.success(roleData);
  });

  signInAndVisit(url);
  andThen(() => {
    click(findInput('role-admin'));
    fillInput('role-name', roleName);
    clickButton('Save');
  });
  andThen(() => {
    assert.equal(currentPath(), 'dashboard.organization.roles.index');
  });
});

test(`visiting ${url} and creating new role with permissions`, (assert) => {
  setup();
  assert.expect(4);

  // tested in previous test
  stubRequest('post', `/organizations/${orgId}/roles`, function(){
    return this.success(roleData);
  });

  let stackId = stacks[0].id;
  let createPermissionUrl = `/accounts/${stackId}/permissions`;

  stubRequest('post', createPermissionUrl, function(request){
    assert.ok(true, `posts to "${createPermissionUrl}"`);
    let json = this.json(request);
    assert.equal(json.scope, 'manage', 'posts correct scope');
    assert.equal(json.role, apiRoleUrl, 'posts correct role');

    return this.success({ links: { role: apiRoleUrl } });
  });

  signInAndVisit(url);
  fillInput('role-name', roleData.name);
  andThen(() => {
    let stackWritePermission = findWithAssert(`.stacks .permission-checkbox:eq(1)`);
    click(stackWritePermission);
  });
  clickButton('Save');
  andThen(() => {
    assert.equal(currentPath(), 'dashboard.organization.roles.index');
  });
});
