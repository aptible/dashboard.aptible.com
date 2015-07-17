import {
  pluralString
} from 'dummy/helpers/plural-string';

import {module, test} from 'qunit';

module('PluralStringHelper');

test('it pluralizes if count !== 1', function(assert) {
  var result = pluralString('Container', 1);
  assert.equal(result, 'Container');

  result = pluralString('Container', 0);
  assert.equal(result, 'Containers');

  result = pluralString('Container', 2);
  assert.equal(result, 'Containers');
});
