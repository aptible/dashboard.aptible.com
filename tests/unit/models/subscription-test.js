import {
  moduleForModel,
  test
} from 'ember-qunit';
import Ember from "ember";
import { stubRequest } from 'ember-cli-fake-server';
import modelDeps from '../../support/common-model-dependencies';

moduleForModel('subscription', 'model:subscription', {
  needs: modelDeps.concat(['adapter:subscription'])
});

test('data is posted upon save', function(assert) {
  assert.expect(4);
  var stripeToken = 'some-token';
  var plan = 'development';
  var organizationId = 'org-1';

  stubRequest('post', '/organizations/org-1/subscriptions', function(request){
    var params = this.json(request);
    assert.equal(params.stripe_token, stripeToken, 'stripe token is correct');
    assert.equal(params.plan, plan, 'plan is correct');
    assert.equal(params.organization_id, organizationId, 'org id is correct');

    return this.success();
  });

  var store = this.store();

  var organization = Ember.run(store, 'push', 'organization', {
    id: organizationId,
    name: 'Sprocket Co.'
  });

  var subscription = Ember.run(store, 'createRecord', 'subscription', {
    organization: organization,
    stripeToken: 'some-token',
    plan: 'development'
  });

  return Ember.run(subscription, 'save').then(function(){
    assert.ok(true, 'subscription was saved');
  });
});
