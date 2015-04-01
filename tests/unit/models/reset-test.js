import {
  moduleForModel,
  test
} from 'ember-qunit';
import modelDeps from '../../support/common-model-dependencies';
import { stubRequest } from '../../helpers/fake-server';
import Ember from 'ember';

moduleForModel('reset', 'model:reset', {
  // Specify the other units that are required for this test.
  needs: modelDeps.concat([
    'adapter:reset'
  ])
});

test('posts to /resets when there is an invitation', function(assert){
  assert.expect(3);
  let done = assert.async();
  let invitationId = 'invite1';

  let store = this.store();
  let model = this.subject({
    type: 'invitation',
    invitationId
  });

  stubRequest('post', `/resets`, function(request){
    assert.ok('posts to correct url');
    let json = this.json(request);
    assert.equal(json.type, 'invitation');
    assert.equal(json.invitation_id, invitationId);
    return this.success({});
  });

  Ember.run(() => {
    model.save().finally(done);
  });
});
