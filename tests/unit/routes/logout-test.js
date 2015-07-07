import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('route:logout',  {
  unit: true,
  needs: 'service:analytics'
});

test('it exists', function() {
  var route = this.subject();
  ok(route);
});
