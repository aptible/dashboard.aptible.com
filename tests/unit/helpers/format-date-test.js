import {
  formatDate
} from '../../../helpers/format-date';
import { module, test } from 'qunit';

module('FormatDateHelper');

test('displays Month, Day Year', function(assert) {
  let date1 = new Date('2015-02-15T19:39:11Z');
  let date2 = new Date('2015-02-05T19:39:11Z');
  let result1 = formatDate(date1);
  let result2 = formatDate(date2);

  assert.equal(result1, 'February 15, 2015');
  assert.equal(result2, 'February 5, 2015');
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
