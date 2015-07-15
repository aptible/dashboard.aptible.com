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

test('it exists', function() {
  var model = this.subject();
  ok(!!model);
});

test('it allowsPHI based on plan', function() {
  var model = this.subject();
  Ember.run(() => {
    model.set('plan', 'development');
  });
  ok(!model.get('allowPHI'), 'PHI not allowed');
  Ember.run(() => {
    model.set('plan', 'production');
  });
  ok(model.get('allowPHI'), 'PHI allowed');
  Ember.run(() => {
    model.set('plan', 'platform');
  });
  ok(model.get('allowPHI'), 'PHI allowed');
});
