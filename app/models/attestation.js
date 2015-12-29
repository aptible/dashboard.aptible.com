import DS from 'ember-data';
import Ember from 'ember';

let Attestation = DS.Model.extend({
  handle: DS.attr('string'),
  organization: DS.attr('string'),
  schemaId: DS.attr('string'),
  document: DS.attr({ defaultValue: {} })
});

Attestation.reopenClass({
  findOrCreate(params, store) {
    let { handle, organization } = Ember.getProperties(params, 'handle', 'organization');

    if (!(handle && organization)) {
      throw new Error('You must provide both a `handle` and an `organization` to Attestation.findOrCreate');
    }

    return new Ember.RSVP.Promise((resolve) => {
      let findParams = { current: true, handle, organization };

      store.find('attestation', findParams)
        .then((attestations) => {
          if (attestations.get('length') === 1) {
            // Create a new attestation using the existing current attestation
            // as a template.

            // TODO: Replace this clone functionality with a different
            // updateRecord method in the Adapter.  Just need to strip ID and use
            // POST rather than PUT
            params.document = attestations.get('firstObject.document');
          }

          // An existing attestation is found, so instantiate a new attestation
          // that uses the existing document as a base.
          resolve(store.createRecord('attestation', params));
        })

        // No attestation found, so instantiate a new attestation using the
        // `defaultDocument` provided
        .catch(() => { resolve( store.createRecord('attestation', params)); });
    });
  }
});

export default Attestation;
