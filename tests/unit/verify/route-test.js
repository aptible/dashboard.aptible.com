import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('route:verify', {
  unit: true,
  needs: ['service:analytics', 'service:elevation']
});

test('it exists', function(assert) {
  var route = this.subject();
  assert.ok(route);
});
