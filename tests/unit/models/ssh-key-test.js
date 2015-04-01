import {
  moduleForModel,
  test
} from 'ember-qunit';
import { stubRequest } from "../../helpers/fake-server";
import Ember from 'ember';
import modelDeps from '../../support/common-model-dependencies';

moduleForModel('ssh-key', 'model:ssh-key', {
  // Specify the other units that are required for this test.
  needs: modelDeps.concat([
    'adapter:ssh-key'
  ])
});

test('posts to /users/:id/ssh_keys', function(assert){
  let done = assert.async();
  assert.expect(1);
  let user, key;
  let store = this.store();
  Ember.run(() => {
    user = store.push('user',{id:'u1'});
  });

  stubRequest('post', '/users/u1/ssh_keys', function(request){
    assert.ok(true, 'posts to correct url');
    return this.success({id:'k1'});
  });

  Ember.run(() => {
    key = store.createRecord('ssh-key', {user});
    key.save().finally(done);
  });
});

test('deletes to /ssh_keys/:id', function(assert){
  let done = assert.async();
  assert.expect(1);
  let user, key;
  let store = this.store();
  Ember.run(() => {
    user = store.push('user',{id:'u1'});
    key = store.push('ssh-key',{id:'k1',user});
  });

  stubRequest('delete', '/ssh_keys/k1', function(request){
    assert.ok(true, 'deletes to correct url');
    return this.noContent();
  });

  Ember.run(() => {
    key.destroyRecord().finally(done);
  });
});
