import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';
import modelDeps from '../../support/common-model-dependencies';
import { stubRequest } from 'ember-cli-fake-server';

moduleForModel('attestation', 'model:attestation', {
  needs: modelDeps.concat(['model:organization-profile'])
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
      let result = model.get('validationErrors.firstObject')
                        .getProperties('path', 'propertyName', 'error');
      assert.deepEqual(result, expected);
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
      let result = model.get('validationErrors.firstObject')
                        .getProperties('path', 'propertyName', 'error');
      assert.deepEqual(result, expected);
    }).finally(done);
  });
});

test('validation errors map nested properties correctly', function(assert) {
  let model = this.subject();
  let done = assert.async();

  stubRequest('post', '/attestations', function() {
    assert.ok(true, 'calls with correct URL');

    return this.error(422, {
      code: 422,
      error: 'internal_server_error',
      message: "The property '#/security_controls/application_unified_logging/technologies' value \"\" did not match one of the following values: ElasticSearch, Papertrail, Splunk, SumoLogic, Other"
    });
  });

  let expected = {
    path: 'security_controls.application_unified_logging.technologies',
    propertyName: 'Technologies',
    error: 'does not match one of the following values: ElasticSearch, Papertrail, Splunk, SumoLogic, Other'
  };

  return Ember.run(() => {
    model.save().catch(() => {
      let result = model.get('validationErrors.firstObject')
                        .getProperties('path', 'propertyName', 'error');
      assert.deepEqual(result, expected);
    }).finally(done);
  });
});

