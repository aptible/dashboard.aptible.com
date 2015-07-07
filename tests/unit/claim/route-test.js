import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('route:claim', {
  unit: true,
  needs: 'service:analytics'
});

test('it exists', function(assert) {
  var route = this.subject();
  assert.ok(route);
});
