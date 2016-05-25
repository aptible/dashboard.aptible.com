import Ember from 'ember';
import Attestation from 'diesel/models/attestation';
import loadSchema from 'diesel/utils/load-schema';

export default Ember.Route.extend({
  model() {
    let handle = 'selected_data_environments';
    let organizationProfile = this.modelFor('compliance-settings');

    return loadSchema(handle).then((schema) => {
      let attestationParams = { handle, schemaId: schema.id, organizationProfile,
                                document: {} };
      let attestation = Attestation.findOrCreate(attestationParams, this.store);
      let schemaDocument = schema.buildDocument();

      return Ember.RSVP.hash({ schema, attestation, schemaDocument });
    });
  },

  afterModel(model) {
    if(model.schemaDocument && model.attestation) {
      model.schemaDocument.load(model.attestation.get('document'));
    }
  },

  setupController(controller, model) {
    let { schema, schemaDocument, attestation } = model;

    controller.set('model', schema);
    controller.set('schemaDocument', schemaDocument);
    controller.set('attestation', attestation);
  },

  actions: {
    save() {
      let { attestation, schemaDocument } = this.currentModel;
      let selectedDataEnvironments = schemaDocument.dump({ excludeInvalid: true });

      attestation.set('document', selectedDataEnvironments);
      attestation.setUser(this.session.get('currentUser'));
      attestation.save().then(() => {
        let message = 'Data Environments saved!';
        Ember.get(this, 'flashMessages').success(message);
      }, (e) => {
        let message = Ember.getWithDefault(e, 'responseJSON.message', 'An error occured');
        Ember.get(this, 'flashMessages').danger(`Save Failed! ${message}`);
      });
    }
  }
});
