import {
  moduleForModel,
  test
} from 'ember-qunit';
import modelDeps from "../../support/common-model-dependencies";
import { stubRequest } from "../../helpers/fake-server";
import Ember from 'ember';

moduleForModel('user', 'model:user', {
  // Specify the other units that are required for this test.
  needs: modelDeps.concat([
    'adapter:user'
  ])
});

test('DELETEs to /organizations/:org_id/users/:id', function(assert) {
  assert.expect(1);
  let done = assert.async();
  let store = this.store();

  let user = Ember.run(store, 'push', 'user', {id:'userId'});
  let organization = Ember.run(store, 'push', 'organization', {id:'orgId'});

  stubRequest('delete', '/organizations/orgId/users/userId', function(request){
    assert.ok(true, 'deletes to correct url');
    return this.noContent();
  });

  Ember.run(() => {
    user.set('organizationId', 'orgId');
    user.destroyRecord().finally(done);
  });
});
