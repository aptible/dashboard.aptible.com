import {
  formatUtcTimestamp
} from '../../../helpers/format-utc-timestamp';
import { module, test } from 'qunit';

module('FormatUtcTimestampHelper');

test('it displays in Month, Day Year HH:MMam/pm UTC format', function(assert) {
  let isoCreatedAtAM = '2014-03-19T09:15:33.836Z';
  let isoCreatedAtPM = '2014-03-19T21:15:33.836Z';
  let isoCreatedAtSingleDigitMinutes = '2014-03-19T21:02:33.836Z';
  let isoCreatedAtDoubleDigitHour = '2014-03-19T11:12:33.836Z';

  let amResult = formatUtcTimestamp( new Date(isoCreatedAtAM) );
  let pmResult = formatUtcTimestamp( new Date(isoCreatedAtPM) );
  let singleDigitResult = formatUtcTimestamp( new Date(isoCreatedAtSingleDigitMinutes) );
  let doubleDigitResult = formatUtcTimestamp( new Date(isoCreatedAtDoubleDigitHour) );

  assert.equal(amResult, 'March 19, 2014 9:15AM UTC');
  assert.equal(pmResult, 'March 19, 2014 9:15PM UTC');
  assert.equal(singleDigitResult, 'March 19, 2014 9:02PM UTC');
  assert.equal(doubleDigitResult, 'March 19, 2014 11:12AM UTC');
});
