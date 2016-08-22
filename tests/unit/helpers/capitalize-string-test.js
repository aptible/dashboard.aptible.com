import {
  capitalizeString
} from 'diesel/helpers/capitalize-string';

import {module, test} from 'qunit';

module('CapitalizeStringHelper');

// Replace this with your real tests.
test('it capitalizes', function(assert) {
  var result = capitalizeString('abc def');
  assert.equal(result, 'Abc def');
});
