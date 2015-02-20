import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('permission', 'Permission', {
  // Specify the other units that are required for this test.
  needs: [
    'model:role',
    'model:stack',
    'model:app',
    'model:database',
    'model:organization'
  ]
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
