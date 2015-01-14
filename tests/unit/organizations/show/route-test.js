import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('route:organizations/show', 'OrganizationsShowRoute', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('it exists', function() {
  var route = this.subject();
  ok(route);
});
