import {
  moduleForModel,
  test
} from 'ember-qunit';
import Ember from 'ember';
import { stubRequest } from 'ember-cli-fake-server';
import modelDeps from '../../support/common-model-dependencies';

moduleForModel('otp-configuration', 'model:otp-configuration', {
  // Specify the other units that are required for this test.
  needs: modelDeps.concat([
    'adapter:otp-configuration'
  ])
});

test('POSTs to /users/:id/otp_configurations', function(assert){
  let done = assert.async();
  assert.expect(1);
  let user, conf;
  let store = this.store();
  Ember.run(() => {
    user = store.push('user',{id:'u1'});
  });

  stubRequest('post', '/users/u1/otp_configurations', function(){
    assert.ok(true, 'posts to correct url');
    return this.success({id:'otp123'});
  });

  Ember.run(() => {
    conf = store.createRecord('otp-configuration', {user});
    conf.save().finally(done);
  });
});
