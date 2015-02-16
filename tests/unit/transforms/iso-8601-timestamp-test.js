import {
  moduleFor,
  test
} from 'ember-qunit';

let isoString = '2015-02-15T09:39:11.000Z';
let date = new Date(isoString);

moduleFor('transform:iso-8601-timestamp', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
});

test('serialize', function(assert) {
  let transform = this.subject();

  assert.deepEqual(
    transform.serialize(date), isoString );
});

test('deserialize', function(assert) {
  let transform = this.subject();

  assert.deepEqual(
    transform.deserialize(isoString), date );
});
