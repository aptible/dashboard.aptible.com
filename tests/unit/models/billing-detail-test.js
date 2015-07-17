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

test('it exists', function(assert) {
  var model = this.subject();
  assert.ok(!!model);
});

test('it allowsPHI based on plan', function(assert) {
  var model = this.subject();
  Ember.run(() => {
    model.set('plan', 'development');
  });
  assert.ok(!model.get('allowPHI'), 'PHI not allowed');
  Ember.run(() => {
    model.set('plan', 'production');
  });
  assert.ok(model.get('allowPHI'), 'PHI allowed');
  Ember.run(() => {
    model.set('plan', 'platform');
  });
  assert.ok(model.get('allowPHI'), 'PHI allowed');
});
