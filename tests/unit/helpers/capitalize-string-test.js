import {
  capitalizeString
} from 'dummy/helpers/capitalize-string';

module('CapitalizeStringHelper');

// Replace this with your real tests.
test('it capitalizes', function() {
  var result = capitalizeString('abc def');
  equal(result, 'Abc def');
});
