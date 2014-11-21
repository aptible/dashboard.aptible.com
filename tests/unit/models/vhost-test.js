import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('vhost', 'Vhost', {
  // Specify the other units that are required for this test.
  needs: ['model:service','model:app']
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
