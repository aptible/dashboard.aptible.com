import {
  moduleForModel,
  test
} from 'ember-qunit';
import modelDeps from '../../support/common-model-dependencies';

moduleForModel('security-control', 'model:security-control', {
  needs: modelDeps
});

test('it exists', function(assert) {
  var model = this.subject();
  assert.ok(!!model);
});
