import {
  moduleForModel,
  test
} from 'ember-qunit';
import Ember from 'ember';
import { stubRequest } from 'ember-cli-fake-server';
import modelDeps from '../../support/common-model-dependencies';


moduleForModel('user', 'model:user', {
  // Specify the other units that are required for this test.
  needs: modelDeps.concat([
    'adapter:user'
  ])
});

test('DELETEs to /organizations/:org_id/users/:id', function(assert) {
  assert.expect(1);
  let done = assert.async();
  let store = this.store();

  let user = Ember.run(store, 'push', 'user', {id:'userId'});
  Ember.run(store, 'push', 'organization', {id:'orgId'});

  stubRequest('delete', '/organizations/orgId/users/userId', function(){
    assert.ok(true, 'deletes to correct url');
    return this.noContent();
  });

  Ember.run(() => {
    user.set('organizationId', 'orgId');
    user.destroyRecord().finally(done);
  });
});

const orgData = {
  id: 1,
  name: 'Sprocket Co',
  handle: 'sprocket-co',
  type: 'organization',
  _links: {
    self: { href: '/organizations/1' }
  }
};

let setupRole = function(organization, store, attributes) {
  const organizationUrl = organization.get('data.links.self');
  let defaultAttributes = {
    id: 'role-1',
    name: 'Account Owner',
    type: 'owner',
    links: { organization: organizationUrl }
  };
  let roleData = Ember.$.extend(true, defaultAttributes, attributes || {});
  return Ember.run(store, 'push', 'role', roleData);
};

test('isRoleType - requires params', function(assert) {
  const store = this.store();
  const user = Ember.run(store, 'push', 'user', {id:'userId'});
  const org = Ember.run(store, 'push', 'organization', orgData);
  const needs = ['platform_user'];
  const roles = Ember.A([setupRole(org, store)]);

  assert.throws(() => { user.isRoleType(null, roles, org); },
    /You must pass types to check against/,
    'expects roles to check against'
  );

  assert.throws(() => { user.isRoleType(needs, undefined, org); },
    /You must pass the user's current roles/,
    'expects the user\'s current roles'
  );

  assert.throws(() => { user.isRoleType(needs, roles, null); },
    /You must pass an organization/,
    'expects roles to check against'
  );
});

test('isRoleType - determines matching roles', function(assert) {
  const store = this.store();
  const user = Ember.run(store, 'push', 'user', {id:'userId'});
  const org = Ember.run(store, 'push', 'organization', orgData);

  const accountOwnerRole = setupRole(org, store);
  const platformOwnerRole = setupRole(org, store, {
    id: 'platform-owner-role-1', name: 'Platform Owner', type: 'platform_owner'
  });
  const platformUserRole = setupRole(org, store, {
    id: 'platform-user-role-1', name: 'DBAs', type: 'platform_user'
  });
  const complianceOwnerRole = setupRole(org, store, {
    id: 'compliance-owner-role-1', name: 'DBAs', type: 'compliance_owner'
  });
  const complianceUserRole = setupRole(org, store, {
    id: 'compliance-user-role-1', name: 'DBAs', type: 'compliance_user'
  });

  let needs = ['platform_user', 'platform_owner', 'owner'];
  let roles = Ember.A([accountOwnerRole, platformOwnerRole]);
  assert.ok(user.isRoleType(needs, roles, org),
    'confirms user has a required role type'
  );

  roles = Ember.A([complianceOwnerRole]);
  assert.notOk(user.isRoleType(needs, roles, org),
    'confirms user does not have a required role type'
  );

  needs = [];
  assert.notOk(user.isRoleType(needs, roles, org));

  needs = ['owner', 'platform_owner', 'compliance_owner'];
  assert.ok(user.isRoleType(needs, roles, org));

  roles = Ember.A([platformUserRole, complianceUserRole]);
  assert.notOk(user.isRoleType(needs, roles, org));
});
