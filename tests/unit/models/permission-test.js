import {
  moduleForModel,
  test
} from 'ember-qunit';
import { stubRequest } from '../../helpers/fake-server';
import modelDeps from '../../support/common-model-dependencies';
import Ember from 'ember';

moduleForModel('permission', 'model:permission', {
  // Specify the other units that are required for this test.
  needs: modelDeps.concat([
    'adapter:permission'
  ])
});

test('to create, it POSTs to /accounts/:id/permissions', function(assert){
  assert.expect(1);
  let done = assert.async();
  let store = this.store();
  let stackId = 'stack-1-id';

  let stack = Ember.run(store, 'push', 'stack', {id:stackId});
  let permission = Ember.run(() => {
    return store.createRecord('permission', {
      stack: stack
    });
  });

  stubRequest('post', `/accounts/${stackId}/permissions`, function(request){
    assert.ok(true, 'posts to correct url');
    return this.noContent();
  });

  Ember.run(() => {
    permission.save().finally(done);
  });
});

test('deletes by DELETEing to /permissions/:id', function(assert){
  let done = assert.async();
  assert.expect(1);
  let store = this.store();
  let permission, stack;

  Ember.run(() => {
    stack = store.push('stack',{id:'s1'});
    permission = store.push('permission',{id:'p1', stack});
  });

  stubRequest('delete', '/permissions/p1', function(request){
    assert.ok(true);
    return this.noContent();
  });

  Ember.run(() => {
    permission.destroyRecord().finally(done);
  });
});
