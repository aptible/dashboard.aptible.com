import {
  moduleForModel,
  test
} from 'ember-qunit';
import modelDeps from "../../support/common-model-dependencies";

moduleForModel('user', 'model:user', {
  // Specify the other units that are required for this test.
  needs: modelDeps
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
