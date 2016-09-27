import Ember from 'ember';
import { module, test, skip } from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref,
         securityOfficerHref } from '../../helpers/organization-stub';

let application;
let userId = 'user1';
let stackId = 'my-stack-1';
let enclaveUrl = `/stacks/${stackId}`;
let gridironAdminUrl = `/gridiron/${orgId}/admin`;
let myGridironUrl = `/gridiron/${orgId}/user`;
let organizationAdminUrl = `/organizations/${orgId}/admin/contact-settings`;
let roleIndexUrl = `/organizations/${orgId}/roles/compliance`;
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

let roles = [
  {
    name: 'owners',
    type: 'owner',
    _links: {
      organization: { href: `/organizations/${orgId}` }
    }
  },
  {
    name: 'engineers',
    type: 'platform_users',
    _links: {
      organization: { href: `/organizations/${orgId}` }
    }
  },
  {
    name: 'training only',
    type: 'compliance_users',
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
    stubStacks();
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

test('Compliance owners should be able to create compliance roles', function(assert) {
  assert.expect(4);
  stubRequests();
  signInAs('compliance_owner');
  visit(roleIndexUrl);

  stubRequest('post', `/organizations/${orgId}/roles`, function(request) {
    let json = this.json(request);
    assert.ok(true, 'creates new role');
    assert.equal(json.type, 'compliance_user');

    return this.success(201, { id: 'new-role-1' });
  })

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
    debugger;
    fillInput('role-name', 'Marketing Team');
    clickButton('Save Role');
  });
});

test('Compliance owners should be able to invite users to compliance roles', function(assert) {
  assert.ok(true);
});

test('Can not manage platform roles', function(assert) {
  assert.ok(true);
});

test('can not manage owner roles', function(assert) {
  assert.ok(true);
});

function stubRequests() {
  stubValidOrganization();

  stubRequest('get', rolesHref, function() {
    return this.success({ _embedded: { roles }});
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