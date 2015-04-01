import {
  moduleForModel,
  test
} from 'ember-qunit';
import Ember from 'ember';
import modelDeps from "../../support/common-model-dependencies";
import { stubRequest } from '../../helpers/fake-server';

moduleForModel('membership', 'model:membership', {
  // Specify the other units that are required for this test.
  needs: modelDeps.concat([
    'adapter:membership'
  ])
});

test('create POSTs to /roles/:role_id/memberships with user url', function(assert) {
  assert.expect(2);
  let done = assert.async();
  let store = this.store();
  let roleId = 'r1';
  let role = Ember.run(store, 'push', 'role', {id:roleId});
  let model = Ember.run(store, 'createRecord', 'membership', {role, userUrl:'/users/1'});

  stubRequest('post', `/roles/${roleId}/memberships`, function(request){
    assert.ok(true, 'posts to correct url');
    assert.equal(this.json(request).user_url, '/users/1', 'has correct user param');
    return this.noContent();
  });

  Ember.run(() => {
    model.save().finally(done);
  });
});

test('destroy DELETEs to /memberships/:id', function(assert){
  assert.expect(1);
  let done = assert.async();
  let store = this.store();
  let membership, role;

  Ember.run(() => {
    role = store.push('role', {id:'r1'});
    membership = store.push('membership', {id:'m1', role});
  });

  stubRequest('delete', `/memberships/m1`, function(request){
    assert.ok(true, 'deletes to correct url');
    return this.noContent();
  });

  Ember.run(() => {
    membership.destroyRecord().finally(done);
  });
});
