import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('route:organization/contact-settings', {
  unit: true,
  needs: 'service:analytics'
});

test('it exists', function(assert) {
  var route = this.subject();
  assert.ok(route);
});
