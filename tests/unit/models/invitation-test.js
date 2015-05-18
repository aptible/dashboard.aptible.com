import {
  moduleForModel,
  test
} from 'ember-qunit';
import Ember from 'ember';
import { stubRequest } from 'ember-cli-fake-server';
import modelDeps from '../../support/common-model-dependencies';

moduleForModel('invitation', 'model:invitation', {
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

test('deletes by DELETEing to /invitations/:id', function(assert){
  let done = assert.async();
  assert.expect(1);
  let store = this.store();
  let invitation, role;

  Ember.run(() => {
    role = store.push('role',{id:'r1'});
    invitation = store.push('invitation',{id:'i1', role});
  });

  stubRequest('delete', '/invitations/i1', function(request){
    assert.ok(true);
    return this.noContent();
  });

  Ember.run(() => {
    invitation.destroyRecord().finally(done);
  });
});
