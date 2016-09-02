import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../../../helpers/start-app';
import { stubRequest } from '../../../helpers/fake-server';

let application;
let orgId = 1; // FIXME this is hardcoded to match the value for signIn in aptible-helpers
let roleId = 'r1';
let url = `/organizations/${orgId}/roles/new`;
let apiRoleUrl = `/roles/${roleId}`;

const roleData = {
  id: roleId,
  name: 'the role name',
  _links: {
    self: { href: apiRoleUrl },
    organization: { href: `/organizations/${orgId}` }
  }
};

module('Acceptance: Organizations: Roles: New', {
  beforeEach: function() {
    application = startApp();
    stubOrganization();
    stubStacks();
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

function setup(plan){
  stubOrganization({id:orgId}, { id: orgId, plan });
  stubStacks({}, stacks);
}

test(`visiting ${url} requires authentication`, () => {
  expectRequiresAuthentication(url);
});

test(`visiting ${url} shows form to create new role`, (assert) => {
  setup('development');
  signInAndVisit(url);
  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.organization.roles.new');
    expectButton('Save');
    expectButton('Cancel');
    expectFocusedInput('role-name');
  });
});

test(`visiting ${url} and creating new platform_user role`, (assert) => {
  setup('production');
  const roleName = roleData.name;

  stubRequest('post', `/organizations/${orgId}/roles`, function(request){
    assert.ok(true, 'posts to /roles');
    let json = this.json(request);
    assert.equal(json.name, roleName, 'has role name');
    assert.equal(json.type, 'platform_user', 'Is a platform user role');
    return this.success(roleData);
  });

  signInAndVisit(url);
  andThen(() => {
    fillInput('role-name', roleData.name);
    findWithAssert('.role-type-option');
    clickButton('Save');
  });
  
  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.enclave.role.members');
  });
});

test(`visiting ${url} and creating new compliance_user role`, (assert) => {
  setup('production');
  const roleName = roleData.name;

  stubRequest('post', `/organizations/${orgId}/roles`, function(request){
    assert.ok(true, 'posts to /roles');
    let json = this.json(request);
    assert.equal(json.name, roleName, 'has role name');
    assert.equal(json.type, 'compliance_user', 'is a compliance user role');
    return this.success(roleData);
  });

  signInAndVisit(url);
  andThen(function() {
    assert.equal(currentPath(), 'requires-authorization.organization.roles.new');
    fillInput('role-name', roleData.name);
    findWithAssert('.role-type-option[data-option-value=compliance_user]').click();
    clickButton('Save');
  });
  andThen(function() {
    assert.equal(currentPath(), 'requires-authorization.enclave.role.members');
  });
});

test(`org visiting ${url} without a compliance allowed plan sees no role type options`, (assert) => {
  setup('dev');
  signInAndVisit(url);
  andThen(() => {
    assert.equal(find('.role-type-option').length, 0, 'no role options displayed');
  });
});
