import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('service', 'Service', {
  // Specify the other units that are required for this test.
  needs: [
    'model:app',
    'model:stack',
    'model:vhost',
    'model:operation'
  ]
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
