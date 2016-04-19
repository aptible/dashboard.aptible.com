import DS from 'ember-data';
import Ember from 'ember';
import User from './user';

let { decamelize, capitalize } = Ember.String;

const INVALID_PROPERTY_TEST = /^The property '#\//;
const MISSING_REQUIRED_PROPERTY_TEST = /did not contain a required property/;
const VALIDATION_PROPERTY_MATCH = /The property '#\/([^']+)'.+/;

function humanize(property) {
  return capitalize(decamelize(property).replace(/_/ig, ' '));
}

function getMissingPropertyError(message) {
  // Example Error:
  // "The property '#/separateOrganizationalUnits' did not contain a required
  // property of 'implemented'"
  "The property '#/separateOrganizationalUnits' did not contain a required property of 'implemented'"
  const VALIDATION_ERROR_MATCH = /The property '#\/.+' (.+)/;
  const PATH_SUFFIX_MATCH = /.*did not contain a required property of '([^']+)'$/

  let initialPath = message.replace(VALIDATION_PROPERTY_MATCH, '$1')
                          .replace('/', '.');
  let pathSuffix = message.replace(PATH_SUFFIX_MATCH, '$1');
  let path = `${initialPath}.${pathSuffix}`;
  let error = 'is required';

  let propertyName = `${humanize(pathSuffix)} ${humanize(initialPath)}`;

  return { path, error, propertyName };
}

function getInvalidPropertyError(message) {
  // Example Error:
  // "The property '#/alertNotifications/enabledNotifications' did not contain
  // a minimum number of items 1"
  const VALIDATION_ERROR_MATCH = /The property '#\/.+' (.+)/;

  let path = message.replace(VALIDATION_PROPERTY_MATCH, '$1')
                          .replace('/', '.');
  let error = message.replace(VALIDATION_ERROR_MATCH, '$1')
                     .replace('did', 'does');
  let property = path.split('.').reverse()[0];
  let propertyName = humanize(property);

  return { path, error, propertyName };
}

let Attestation = DS.Model.extend({
  handle: DS.attr('string'),
  organizationUrl: DS.attr('string'),
  userUrl: DS.attr('string'),
  userName: DS.attr('string'),
  userEmail: DS.attr('string'),
  schemaId: DS.attr('string'),
  document: DS.attr({ defaultValue: {} }),
  createdAt: DS.attr('iso-8601-timestamp'),

  setUser(user) {
    Ember.assert('user must be a User model', user instanceof User);

    let userUrl = user.get('data.links.self');
    let userName = user.get('name');
    let userEmail = user.get('email');

    this.setProperties({ userUrl, userName, userEmail });
  },

  validationErrors: Ember.computed('errors.[]', function() {
    let validationErrors = [];
    this.get('errors').forEach((error) => {
      if(MISSING_REQUIRED_PROPERTY_TEST.test(error.message)) {
        validationErrors.push(getMissingPropertyError(error.message));
      } else if(INVALID_PROPERTY_TEST.test(error.message)) {
        validationErrors.push(getInvalidPropertyError(error.message));
      }
    });
    return validationErrors;
  })
});

Attestation.reopenClass({
  findOrCreate(params, store) {
    if (!(params.handle && params.organizationUrl)) {
      throw new Error('You must provide both a `handle` and an `organizationUrl` to `Attestation.findOrCreate`');
    }

    let handle = params.handle;
    let organization = params.organizationUrl;
    let findParams = { current: true, handle, organization };

    return new Ember.RSVP.Promise((resolve) => {
      store.find('attestation', findParams)
        .then((attestations) => {
          // Resolve any attestation returned (should be limited to 1), otherwise
          // instantiate a new attestation and return it
          let attestation = attestations.get('firstObject') ||
                            store.createRecord('attestation', params);
          resolve(attestation);
        })

        // In case of error, just create new attestation
        .catch(() => { resolve( store.createRecord('attestation', params)); });
    });
  }
});

export default Attestation;
