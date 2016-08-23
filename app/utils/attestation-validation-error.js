import Ember from 'ember';

let { decamelize, capitalize } = Ember.String;

const VALIDATION_PROPERTY_MATCH = /The property '#\/([^']+)'.+/;
const MISSING_REQUIRED_PROPERTY_TEST = /did not contain a required property/;
const MISSING_ITEM_PROPERTY_TEST = /did not contain a minimum number of items/;
const ENUM_MISMATCH_PROPERTY_TEST = /did not match one of the following values/;

export function humanize(property) {
  return capitalize(decamelize(property).replace(/_/ig, ' '));
}

function propertyNameFromPath(path) {
  return humanize(path.split('.').reverse()[0]);
}

export default Ember.Object.extend({
  init() {
    this._super(...arguments);

    let message = this.get('message');

    if(message.match(MISSING_REQUIRED_PROPERTY_TEST)) {
      this.initAsMissingRequiredPropertyError();
    } else if(message.match(MISSING_ITEM_PROPERTY_TEST)) {
      this.initAsMissingItemError();
    } else if(message.match(ENUM_MISMATCH_PROPERTY_TEST)) {
      this.initAsMissingEnumError();
    } else {
      this.initAsGenericPropertyError();
    }
  },

  propertyPath: Ember.computed('message', function() {
    return this.get('message').replace(VALIDATION_PROPERTY_MATCH, '$1')
                              .replace(/\//ig, '.');
  }),

  initAsMissingRequiredPropertyError() {
    // Example Error:
    // "The property '#/separateOrganizationalUnits' did not contain a required
    // property of 'implemented'"
    const PATH_SUFFIX_MATCH = /.*did not contain a required property of '([^']+)'$/;
    let message = this.get('message');
    let initialPath = this.get('propertyPath');
    let pathSuffix = message.replace(PATH_SUFFIX_MATCH, '$1');
    let path = `${initialPath}.${pathSuffix}`;
    let error = 'is required';

    let propertyName = `${humanize(pathSuffix)} ${humanize(initialPath)}`;

    this.setProperties({ path, error, propertyName });
  },

  initAsMissingItemError() {
    // Example Error:
    // "The property '#/alertNotifications/enabledNotifications' did not contain
    // a minimum number of items 1"
    const VALIDATION_ERROR_MATCH = /The property '#\/.+' (.+)/;
    let message = this.get('message');
    let path = this.get('propertyPath');
    let error = message.replace(VALIDATION_ERROR_MATCH, '$1')
                       .replace('did', 'does');
    let propertyName = propertyNameFromPath(path);

    this.setProperties({ path, error, propertyName });
  },

  initAsMissingEnumError() {
    // Example Error:
    // The property '#/security_controls/application_unified_logging/technologies'
    // value \"\" did not match one of the following values: ElasticSearch,
    // Papertrail, Splunk, SumoLogic, Other
    let message = this.get('message');
    let path = this.get('propertyPath');

    let REQUIRED_VALUES_MATCH = /^.+one of the following values: (.+)$/;
    let requiredValues = message.replace(REQUIRED_VALUES_MATCH, '$1');
    let error = `does not match one of the following values: ${requiredValues}`;
    let propertyName = propertyNameFromPath(path);

    this.setProperties({ path, error, propertyName });
  },

  initAsGenericPropertyError() {
    let path = null;
    let propertyName = null;
    let error = this.get('message');

    this.setProperties({ path, error, propertyName });
  }
});