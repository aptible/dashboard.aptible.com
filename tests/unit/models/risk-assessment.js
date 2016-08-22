import {
  moduleForModel,
  test
} from 'ember-qunit';
import modelDeps from '../../support/common-model-dependencies';

moduleForModel('risk-assessment', 'model:risk-assessment', {
  needs: modelDeps
});

test('it exists', function(assert) {
  var model = this.subject();
  assert.ok(!!model);
});
