import {
  formatDiskSize
} from '../../../helpers/format-disk-size';
import { module, test } from 'qunit';

module('FormatDiskSizeHelper');

test('it formats undefined as 0GB', function(assert) {
  assert.equal(formatDiskSize(), '0GB');
});

test('it formats GB values', function(assert) {
  assert.equal(formatDiskSize(42), '42GB');
  assert.equal(formatDiskSize(1002), '1002GB');
});

test('it formats TB values', function(assert) {
  assert.equal(formatDiskSize(1500), '1.46TB');
  assert.equal(formatDiskSize(3000), '2.93TB');
});
