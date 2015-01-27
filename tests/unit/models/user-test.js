import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('user', 'User', {
  // Specify the other units that are required for this test.
  needs: ['model:token', 'model:role', 'model:organization','model:ssh-key']
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
