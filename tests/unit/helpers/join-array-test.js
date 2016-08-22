import {
  joinArray
} from '../../../helpers/join-array';
import { module, test } from 'qunit';

module('JoinArrayHelper');

// Replace this with your real tests.
test('it works', function(assert) {
  var result = joinArray([4,5], ', ');
  assert.equal(result, '4, 5');
});
