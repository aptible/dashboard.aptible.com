import Ember from 'ember';
import Property from 'ember-json-schema-document/models/property';
import Attestation from 'sheriff/models/attestation';
import loadSchema from 'sheriff/utils/load-schema';

export default Ember.Route.extend({
  model() {
    let handle = 'workforce_locations';
    let organizationUrl = this.modelFor('organization').get('data.links.self');

    return loadSchema(handle).then((schema) => {
      let attestationParams = { handle, schemaId: schema.id, organizationUrl,
                                document: [] };
      let attestation = Attestation.findOrCreate(attestationParams, this.store);
      let schemaDocument = schema.buildDocument();

      return Ember.RSVP.hash({ schema, attestation, schemaDocument });
    });
  },

  setupController(controller, model) {
    let { schemaDocument, schema, attestation } = model;

    controller.set('schema', schema);
    controller.set('attestation', attestation);
    controller.set('document', schemaDocument);
    controller.set('locationProperty', new Property(schema._schema.items));
  },

  afterModel(model) {
    if(model.schemaDocument && model.attestation) {
      model.schemaDocument.load(model.attestation.get('document'));
    }
  },

  saveState() {
    let { schemaDocument, attestation } = this.currentModel;

    attestation.set('document', schemaDocument.dump({ excludeInvalid: true }));
    attestation.save().then(() => {
      let message = 'Locations saved!';
      Ember.get(this, 'flashMessages').success(message);
    }, (e) => {
      let message = Ember.getWithDefault(e, 'responseJSON.message', 'An error occured');
      Ember.get(this, 'flashMessages').danger(`Save Failed! ${message}`);
    });
  },

  actions: {
    save() {
      this.saveState();
    },

    onAddLocation() {
      this.controller.addNewLocation();
    }
  }
});