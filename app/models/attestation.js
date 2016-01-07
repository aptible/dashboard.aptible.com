import DS from 'ember-data';
import Ember from 'ember';

let Attestation = DS.Model.extend({
  handle: DS.attr('string'),
  organizationUrl: DS.attr('string'),
  schemaId: DS.attr('string'),
  document: DS.attr({ defaultValue: {} })
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
