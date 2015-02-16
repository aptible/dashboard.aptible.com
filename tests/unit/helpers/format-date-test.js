import {
  formatDate
} from '../../../helpers/format-date';
import { module, test } from 'qunit';

module('FormatDateHelper');

let date = new Date('2015-02-15T19:39:11Z');

test('displays Month, Day Year', function(assert) {
  var result = formatDate(date);
  assert.equal(result, 'February 15, 2015');
});

test('handles empty values', function(assert) {
  try {
    formatDate(undefined);
    formatDate(null);
  } catch(e) {
    assert.ok(false, 'should not blow up on empty values');
  }
  assert.ok(true);
});
