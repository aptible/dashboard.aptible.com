import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('password-reset-request', 'model:password-reset-request', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
