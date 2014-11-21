import {
  pluralString
} from 'diesel/helpers/plural-string';

module('PluralStringHelper');

test('it pluralizes if count !== 1', function() {
  var result = pluralString('Container', 1);
  equal(result, 'Container');

  result = pluralString('Container', 0);
  equal(result, 'Containers');

  result = pluralString('Container', 2);
  equal(result, 'Containers');
});
