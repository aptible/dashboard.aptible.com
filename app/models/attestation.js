import DS from 'ember-data';
import Ember from 'ember';

let Attestation = DS.Model.extend({
  handle: DS.attr('string'),
  organization: DS.attr('string'),
  document: DS.attr({ defaultValue: {} })
});

Attestation.reopenClass({
  create(handle, organization, document, store) {
    let params = { handle, document,
                   organization: organization.get('data.links.self') };
    return store.createRecord('attestation', params);
  },

  findOrCreate(handle, organization, defaultDocument, store) {
    return new Ember.RSVP.Promise((resolve) => {
      let findParams = { handle: handle, current: true,
                         organization: organization.get('data.links.self') };
      store.find('attestation', findParams)
        .then((attestations) => {
          if (attestations.get('length') === 1) {
            // Create a new attestation using the existing current attestation
            // as a template.

            // TODO: Replace this clone functionality with a different
            // updateRecord method in the Adapter.  Just need to strip ID and use
            // POST rather than PUT
            defaultDocument = attestations.get('firstObject.document');
          }

          resolve(this.create(handle, organization, defaultDocument, store));
        })
        .catch(() => { resolve(this.create(handle, organization, defaultDocument, store)); });
    });
  }
});

export default Attestation;
