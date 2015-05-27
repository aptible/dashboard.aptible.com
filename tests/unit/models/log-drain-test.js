import {
  moduleForModel,
  test
} from 'ember-qunit';
import Ember from 'ember';
import { stubRequest } from 'ember-cli-fake-server';
import modelDeps from '../../support/common-model-dependencies';

moduleForModel('log-drain', 'model:log-drain', {
  // Specify the other units that are required for this test.
  needs: modelDeps.concat([
    'adapter:log-drain'
  ])
});

test('posts to /accounts/:stack_id/log_drains', function(assert){
  let done = assert.async();
  assert.expect(1);
  let stack, drain;
  let store = this.store();
  Ember.run(() => {
    stack = store.push('stack',{id:'s1'});
  });

  stubRequest('post', '/accounts/s1/log_drains', function(request){
    assert.ok(true, 'posts to correct url');
    return this.success({id:'ld1'});
  });

  Ember.run(() => {
    drain = store.createRecord('log-drain', {stack});
    drain.save().finally(done);
  });
});

