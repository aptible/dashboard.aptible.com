import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('route:settings:logout',  {
  unit: true,
  needs: ['service:analytics', 'service:elevation']
});

test('it exists', function(assert) {
  var route = this.subject();
  assert.ok(route);
});
