import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('database', 'Database', {
  // Specify the other units that are required for this test.
  needs: ['model:stack','model:app']
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
