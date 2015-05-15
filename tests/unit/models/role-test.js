import {
  moduleForModel,
  test
} from 'ember-qunit';
import Ember from 'ember';
import { stubRequest } from '../../helpers/fake-server';
import modelDeps from '../../support/common-model-dependencies';

moduleForModel('role', 'model:role', {
  // Specify the other units that are required for this test.
  needs: modelDeps.concat([
    'adapter:role'
  ])
});

test('creates by POSTing to /organizations/:org_id/roles', function(assert){
  let done = assert.async();
  assert.expect(1);

  let orgId = 'org1';
  let store = this.store();
  let organization = Ember.run(store, 'push', 'organization', {id:orgId});

  stubRequest('post', `/organizations/${orgId}/roles`, function(request){
    assert.ok(true, 'posts to correct url');
    return this.noContent();
  });

  Ember.run(() => {
    let role = store.createRecord('role', {organization});
    role.save().finally(done);
  });
});

test('updates by PUTting to /roles/:role_id', function(assert){
  let done = assert.async();
  assert.expect(2);

  let roleId = 'r1';
  let orgId = 'org1';
  let store = this.store();
  let organization = Ember.run(store, 'push', 'organization', {id:orgId});
  let role = Ember.run(store, 'push', 'role', {
    id:roleId,
    organization
  });

  stubRequest('put', `/roles/${roleId}`, function(request){
    assert.ok(true, 'puts to correct url');
    let json = this.json(request);
    assert.equal(json.name, 'new name');
    return this.noContent();
  });

  Ember.run(() => {
    role.set('name', 'new name');
    role.save().finally(done);
  });
});

test('destroy DELETEs to /roles/:id', function(assert){
  assert.expect(1);
  let done = assert.async();
  let store = this.store();
  let role, organization;

  Ember.run(() => {
    organization = store.push('organization', {id:'o1'});
    role = store.push('role', {id:'r1', organization});
  });

  stubRequest('delete', `/roles/r1`, function(request){
    assert.ok(true, 'deletes to correct url');
    return this.noContent();
  });

  Ember.run(() => {
    role.destroyRecord().finally(done);
  });
});
