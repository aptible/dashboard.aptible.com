import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('route:welcome/payment-info', {
  unit: true,
  needs: 'service:analytics'
});

test('it exists', function() {
  var route = this.subject();
  ok(route);
});
