import Ember from 'ember';
import Attestation from 'sheriff/models/attestation';
import loadSchema from 'sheriff/utils/load-schema';

export default Ember.Route.extend({
  model() {
    let handle = 'selected_data_environments';
    let organizationUrl = this.modelFor('organization').get('data.links.self');

    return loadSchema(handle).then((schema) => {
      let attestationParams = { handle, schemaId: schema.id, organizationUrl,
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
    controller.set('model', model.schema);
    controller.set('schemaDocument', model.schemaDocument);
    controller.set('attestation', model.attestation);
  },

  actions: {
    save() {
      let { attestation, schemaDocument } = this.currentModel;
      let selectedDataEnvironments = schemaDocument.dump({ excludeInvalid: true });

      attestation.set('document', selectedDataEnvironments);
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
