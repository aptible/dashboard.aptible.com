import {
  module,
  test
} from 'qunit';

import { getUrlParameter, getUrlParameters } from '../../../utils/url-parameters';

module('Unit: getUrlParameter');

test('reads a parameter from a location object', function(assert) {
  var location = { search: '?foo=bar' };
  var result = getUrlParameter(location, 'foo');
  assert.equal(result, 'bar', 'foo param is read');
});

test('reads no parameter from a location object without any', function(assert) {
  var location = { search: '' };
  var result = getUrlParameter(location, 'foo');
  assert.equal(result, undefined, 'foo param is not present');
});

module('Unit: getUrlParameters');

test('reads paramters', function(assert) {
  var location = { search: '?foo=bar&meep=with%20space' };
  var result = getUrlParameters(location);
  assert.equal(result.foo, 'bar', 'foo param is present');
  assert.equal(result.meep, 'with space', 'meep param is present and decoded');
});
