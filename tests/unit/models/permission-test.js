import {
  moduleForModel,
  test
} from 'ember-qunit';
import modelDeps from '../../support/common-model-dependencies';
import { stubRequest } from '../../helpers/fake-server';
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
