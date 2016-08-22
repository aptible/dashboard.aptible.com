import {
  module,
  test
} from 'qunit';
import Ember from 'ember';

import Changeset from 'diesel/utils/changeset';

let changeset, keyData;

module('Unit: Changeset', {
  beforeEach() {
    changeset = Changeset.create({
      key(keyData) {
        return JSON.stringify(keyData);
      },
      initialValue() {
        return false;
      }
    });

    keyData = {a:1};
  },
  afterEach() {
    Ember.run(changeset, 'destroy');
  }
});

test('throws if key is not set', (assert) => {
  assert.throws(() => {
    changeset = Changeset.create({
      initialValue: Ember.K
    });
  }, /must define `key`/);
});

test('throws if initialValue is not set', (assert) => {
  assert.throws(() => {
    changeset = Changeset.create({
      key: Ember.K
    });
  }, /must define `initialValue`/);
});

test('value can change from false to true', (assert) => {
  assert.expect(3);

  changeset.setValue(keyData, true);
  changeset.forEachValue((_keyData, initialValue, value) => {
    assert.equal(_keyData, keyData, 'key data is passed through');
    assert.ok(!initialValue, 'initial value is false');
    assert.ok(value, 'value is true');
  });
});

// this ensures that we aren't falling back to initialValue
// if currentValue is falsy
test('value can change from true to false', (assert) => {
  assert.expect(3);

  changeset = Changeset.create({
    key(keyData) {
      return JSON.stringify(keyData);
    },
    initialValue() {
      return true;
    }
  });

  changeset.setValue(keyData, false);
  changeset.forEachValue((_keyData, initialValue, value) => {
    assert.equal(_keyData, keyData, 'key data is passed through');
    assert.ok(initialValue, 'initial value is true');
    assert.ok(!value, 'value is false');
  });
});

test('subscription hook is notified of changes', (assert) => {
  assert.expect(3);

  let passedValues = [];
  let callCount = 0;

  changeset.subscribe(keyData, () => {
    callCount++;
    passedValues.push( changeset.value(keyData) );
  });

  changeset.setValue(keyData, 'abc');
  changeset.setValue(keyData, 'def');

  assert.equal(callCount, 2, 'called 2x');
  assert.equal(passedValues[0], 'abc');
  assert.equal(passedValues[1], 'def');
});

test('subscribeAll is notified of every `setValue` call', (assert) => {
  assert.expect(2);

  let keyData1 = {a:1};
  let keyData2 = {a:2};
  let notifs = [];

  changeset.subscribeAll((sourceKeyData) => {
    notifs.push(sourceKeyData);
  });

  changeset.setValue(keyData1, 'abc');
  assert.deepEqual(notifs, [keyData1], 'called with the sourceKeyData');

  changeset.setValue(keyData2, 'def');
  assert.deepEqual(notifs, [keyData1, keyData2], 'called again with the second sourceKeyData');
});

test('subscribeAll is notified on initial `value` call', (assert) => {
  assert.expect(2);

  let keyData1 = {a:1};
  let keyData2 = {a:2};
  let notifs = [];

  changeset.subscribeAll((sourceKeyData) => {
    notifs.push(sourceKeyData);
  });

  changeset.value(keyData1);
  assert.deepEqual(notifs, [keyData1], 'called with the sourceKeyData');

  changeset.value(keyData2);
  assert.deepEqual(notifs, [keyData1, keyData2], 'called again with the second sourceKeyData');
});

test('forEachValue yields final set value', (assert) => {
  assert.expect(3);
  changeset.setValue(keyData, 'v1');
  changeset.setValue(keyData, 'v2');

  changeset.forEachValue((_keyData, initialValue, value) => {
    assert.equal(_keyData, keyData, 'correct keyData');
    assert.ok(!initialValue, 'no initial value');
    assert.equal(value, 'v2', 'final value is passed');
  });
});

test('initialValue hook is called with keyData when read', (assert) => {
  let passedKeyData;

  changeset = Changeset.create({
    key(keyData) {
      return JSON.stringify(keyData);
    },
    initialValue(keyData) {
      passedKeyData = keyData;
      return keyData;
    }
  });

  let keyData = {};
  let result = changeset.value(keyData);

  assert.equal(passedKeyData, keyData, 'initialValue is given keyData');
  assert.equal(result, keyData, 'initial value is result of `initialValue` hook');
});

test('forEachValue returns values that are read but not set', (assert) => {
  changeset = Changeset.create({
    key(keyData) {
      return JSON.stringify(keyData);
    },
    initialValue() {
      return false;
    }
  });

  let keyData = {};
  changeset.value(keyData);

  changeset.forEachValue((_keyData) => {
    assert.equal(_keyData, keyData, 'forEachValue yields for the keyData that was read');
  });
});
