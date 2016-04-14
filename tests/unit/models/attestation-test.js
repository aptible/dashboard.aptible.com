import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';
import modelDeps from '../../support/common-model-dependencies';
import { stubRequest } from 'ember-cli-fake-server';

moduleForModel('attestation', 'model:attestation', {
  needs: modelDeps
});

test('it exists', function(assert) {
  let model = this.subject();
  assert.ok(!!model);
});


test('it maps schema errors to `validationErrors` property', function(assert) {
  let model = this.subject();
  let done = assert.async();

  stubRequest('post', '/attestations', function() {
    assert.ok(true, 'calls with correct URL');

    return this.error(422, {
      code: 422,
      error: 'internal_server_error',
      message: "The property '#/alertNotifications/enabledNotifications' did not contain a minimum number of items 1"
    });
  });

  let expected = {
    path: 'alertNotifications.enabledNotifications',
    propertyName: 'Enabled notifications',
    error: 'does not contain a minimum number of items 1'
  };

  return Ember.run(() => {
    model.save().catch(() => {
      assert.deepEqual(model.get('validationErrors'), [expected]);
    }).finally(done);
  });
});

test('validation errors for required fields are mapped correctly', function(assert) {
  let model = this.subject();
  let done = assert.async();

  stubRequest('post', '/attestations', function() {
    assert.ok(true, 'calls with correct URL');

    return this.error(422, {
      code: 422,
      error: 'internal_server_error',
      message: "The property '#/separateOrganizationalUnits' did not contain a required property of 'implemented'"
    });
  });

  let expected = {
    path: 'separateOrganizationalUnits.implemented',
    propertyName: 'Implemented Separate organizational units',
    error: 'is required'
  };

  return Ember.run(() => {
    model.save().catch(() => {
      assert.deepEqual(model.get('validationErrors'), [expected]);
    }).finally(done);
  });
});
