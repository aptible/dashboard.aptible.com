import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('role', 'Role', {
  // Specify the other units that are required for this test.
  needs: ['model:organization']
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
