import DS from 'ember-data';
import Ember from 'ember';

let { decamelize, capitalize } = Ember.String;

export const VALIDATION_ERROR_TEST = /#\//;
export const VALIDATION_PROPERTY_MATCH = /The property '#\/([^']+)'.+/;
export const VALIDATION_ERROR_MATCH = /The property '#\/.+' (.+)/;

let Attestation = DS.Model.extend({
  handle: DS.attr('string'),
  organizationUrl: DS.attr('string'),
  schemaId: DS.attr('string'),
  document: DS.attr({ defaultValue: {} }),
  createdAt: DS.attr('iso-8601-timestamp'),

  validationErrors: Ember.computed('errors.[]', function() {
    let validationErrors = [];
    this.get('errors').forEach((error) => {
      let message = error.message;
      if (VALIDATION_ERROR_TEST.test(message)) {
        let path = message.replace(VALIDATION_PROPERTY_MATCH, '$1')
                          .replace('/', '.');
        let error = message.replace(VALIDATION_ERROR_MATCH, '$1')
                           .replace('did', 'does');

        let property = path.split('.').reverse()[0];
        let propertyName = capitalize(decamelize(property).replace('_', ' '));

        validationErrors.push({ path, error, propertyName });
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
