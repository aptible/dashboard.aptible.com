import {
  moduleForModel,
  test
} from 'ember-qunit';
import modelDeps from '../../support/common-model-dependencies';
import Ember from "ember";

moduleForModel('billing-detail', 'model:billing-detail', {
  // Specify the other units that are required for this test.
  needs: modelDeps
});

var setupModel = function(model, props) {
  Ember.run(() => {
    for (var prop in props) {
      model.set(prop, props[prop]);
    }
  });
};

test('it exists', function(assert) {
  var model = this.subject();
  assert.ok(!!model);
});

test('it allowsPHI based on plan', function(assert) {
  var model = this.subject();
  setupModel(model, { plan: 'development' });
  assert.ok(!model.get('allowPHI'), 'PHI not allowed');

  setupModel(model, { plan: 'not-a-valid-plan' });
  assert.ok(!model.get('allowPHI'), 'PHI not allowed');

  setupModel(model, { plan: 'pilot' });
  assert.ok(model.get('allowPHI'), 'PHI allowed');

  setupModel(model, { plan: 'production' });
  assert.ok(model.get('allowPHI'), 'PHI allowed');

  setupModel(model, { plan: 'platform' });
  assert.ok(model.get('allowPHI'), 'PHI allowed');
});

test('it correctly sets containersInPlan', function(assert) {
  var model = this.subject();
  setupModel(model, { plan: 'not-a-valid-plan' });
  assert.equal(model.get('containersInPlan'), 0);

  setupModel(model, { plan: 'platform' });
  assert.equal(model.get('containersInPlan'), 6);

  setupModel(model, { plan: 'development', containerAllowance: 0 });
  assert.equal(model.get('containersInPlan'), 0);

  setupModel(model, { plan: 'platform', containerAllowance: 20 });
  assert.equal(model.get('containersInPlan'), 20);
});

test('it correctly sets diskSpaceInPlan', function(assert) {
  var model = this.subject();
  setupModel(model, { plan: 'not-a-valid-plan' });
  assert.equal(model.get('diskSpaceInPlan'), 0);

  setupModel(model, { plan: 'platform' });
  assert.equal(model.get('diskSpaceInPlan'), 1000);

  setupModel(model, { plan: 'development', diskAllowance: 0 });
  assert.equal(model.get('diskSpaceInPlan'), 0);

  setupModel(model, { plan: 'platform', diskAllowance: 2000 });
  assert.equal(model.get('diskSpaceInPlan'), 2000);
});

test('it correctly sets domainsInPlan', function(assert) {
  var model = this.subject();
  setupModel(model, { plan: 'not-a-valid-plan' });
  assert.equal(model.get('domainsInPlan'), 0);

  setupModel(model, { plan: 'platform' });
  assert.equal(model.get('domainsInPlan'), 4);

  setupModel(model, { plan: 'development' });
  assert.equal(model.get('domainsInPlan'), 0);

  setupModel(model, { plan: 'platform', domainAllowance: 20 });
  assert.equal(model.get('domainsInPlan'), 20);
});
