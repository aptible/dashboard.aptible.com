import {
  moduleForModel,
  test
} from 'ember-qunit';
import modelDeps from '../../support/common-model-dependencies';
import Ember from 'ember';
import { stubRequest } from '../../helpers/fake-server';

moduleForModel('invitation', {
  // Specify the other units that are required for this test.
  needs: modelDeps.concat([
    'adapter:invitation'
  ])
});

test('creating POSTS to a url prefixed with roles/:id', function(assert) {
  let done = assert.async();
  assert.expect(1);

  let store = this.store();
  let roleId = 'role-abc-def';
  let role = Ember.run(store, 'push', 'role', {id:roleId});
  let model = Ember.run(store, 'createRecord', 'invitation', {role});
  let url = `/roles/${roleId}/invitations`;

  stubRequest('post', url, function(request){
    assert.ok(true, `posts to "${url}`);
    return this.success();
  });

  Ember.run(() => {
    model.save().finally(done);
  });
});
