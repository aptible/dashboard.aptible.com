import {
  test
} from 'ember-qunit';
import Ember from 'ember';

import Changeset from 'diesel/utils/changeset';

let changeset, keyData;

module('Unit: Changeset', {
  setup(){
    changeset = Changeset.create({
      key(keyData){
        return JSON.stringify(keyData);
      },
      initialValue(keyData){
        return false;
      }
    });

    keyData = {a:1};
  },
  teardown(){
    Ember.run(changeset, 'destroy');
  }
});

test('value can change from false to true', (assert) => {
  assert.expect(3);

  changeset.setValue(keyData, true);
  changeset.forEachValue((_keyData, initialValue, value) => {
    assert.equal(_keyData, keyData, 'key data is passed through');
    assert.ok(!initialValue, 'intital value is false');
    assert.ok(value, 'value is true');
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
    key(keyData){
      return JSON.stringify(keyData);
    },
    initialValue(keyData){
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
  let passedKeyData;

  changeset = Changeset.create({
    key(keyData){
      return JSON.stringify(keyData);
    },
    initialValue(keyData){
      return false;
    }
  });

  let keyData = {};
  let result = changeset.value(keyData);

  changeset.forEachValue((_keyData) => {
    assert.equal(_keyData, keyData, 'forEachValue yields for the keyData that was read');
  });
});
