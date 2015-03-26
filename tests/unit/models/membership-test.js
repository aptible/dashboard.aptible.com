import {
  moduleForModel,
  test
} from 'ember-qunit';
import Ember from 'ember';
import modelDeps from "../../support/common-model-dependencies";
import { stubRequest } from '../../helpers/fake-server';

moduleForModel('membership', {
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
  let model = Ember.run(store, 'createRecord', 'membership', {role, user:'/users/1'});

  stubRequest('post', `/roles/${roleId}/memberships`, function(request){
    assert.ok(true, 'posts to correct url');
    assert.equal(this.json(request).user, '/users/1', 'has correct user param');
    return this.noContent();
  });

  Ember.run(() => {
    model.save().finally(done);
  });
});
