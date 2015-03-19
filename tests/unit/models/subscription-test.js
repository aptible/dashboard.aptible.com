import {
  moduleForModel,
  test
} from 'ember-qunit';
import Ember from "ember";
import { stubRequest } from '../../helpers/fake-server';
import modelDeps from '../../support/common-model-dependencies';

moduleForModel('subscription', 'Subscription', {
  needs: modelDeps
});

test('data is posted upon save', function() {
  expect(4);
  var stripeToken = 'some-token';
  var plan = 'development';
  var organizationId = 'org-1';

  stubRequest('post', '/organizations/org-1/subscriptions', function(request){
    var params = this.json(request);
    equal(params.stripe_token, stripeToken, 'stripe token is correct');
    equal(params.plan, plan, 'plan is correct');
    equal(params.organization_id, organizationId, 'org id is correct');

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

  return Ember.run(subscription, 'save').then(function(s){
    ok(true, 'subscription was saved');
  });
});
