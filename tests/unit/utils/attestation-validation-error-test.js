import { module, test } from 'qunit';
import AttestationValidationError from '../../../utils/attestation-validation-error';

module('Unit: AttestationValidationError');

test('Missing required property error', function(assert) {
  let message ="The property '#/separateOrganizationalUnits' did not contain a required property of 'implemented'";
  let error = AttestationValidationError.create({ message });
  let expected = { path: 'separateOrganizationalUnits.implemented',
                   propertyName: 'Implemented Separate organizational units',
                   error: 'is required' };

  assert.deepEqual(error.getProperties('path', 'propertyName', 'error'), expected);
});

test('Missing array item property error', function(assert) {
  let message = "The property '#/alertNotifications/enabledNotifications' did not contain a minimum number of items 1";
  let error = AttestationValidationError.create({ message });
  let expected = { path: 'alertNotifications.enabledNotifications',
                   propertyName: 'Enabled notifications',
                   error: 'does not contain a minimum number of items 1' };

  assert.deepEqual(error.getProperties('path', 'propertyName', 'error'), expected);
});

test('Enum mismatch property error', function(assert) {
  let message ="The property '#/security_controls/application_unified_logging/technologies' value \"\" did not match one of the following values: ElasticSearch, Papertrail, Splunk, SumoLogic, Other";
  let error = AttestationValidationError.create({ message });
  let expected = { path: 'security_controls.application_unified_logging.technologies',
                   propertyName: 'Technologies',
                   error: 'does not match one of the following values: ElasticSearch, Papertrail, Splunk, SumoLogic, Other' };

  assert.deepEqual(error.getProperties('path', 'propertyName', 'error'), expected);
});

test('Generic property error', function(assert) {
  let message ="An error occurred";
  let error = AttestationValidationError.create({ message });
  let expected = { path: null,
                   propertyName: null,
                   error: message };

  assert.deepEqual(error.getProperties('path', 'propertyName', 'error'), expected);
});
