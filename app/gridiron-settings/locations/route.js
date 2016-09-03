import Ember from 'ember';
import Property from 'ember-json-schema-document/models/property';
import Attestation from 'diesel/models/attestation';
import loadSchema from 'diesel/utils/load-schema';

export default Ember.Route.extend({
  model() {
    let handle = 'workforce_locations';
    let organizationProfile = this.modelFor('gridiron-settings');

    return loadSchema(handle).then((schema) => {
      let attestationParams = { handle, schemaId: schema.id, organizationProfile,
                                document: [] };
      let attestation = Attestation.findOrCreate(attestationParams, this.store);
      let schemaDocument = schema.buildDocument();

      return Ember.RSVP.hash({ schema, attestation, schemaDocument });
    });
  },

  setupController(controller, model) {
    let { schemaDocument, schema, attestation } = model;
    let locationProperty = new Property(schema._schema.items);

    controller.setProperties({ schema, attestation, schemaDocument,
                               locationProperty });
  },

  afterModel(model) {
    if(model.schemaDocument && model.attestation) {
      model.schemaDocument.load(model.attestation.get('document'));
    }
  },

  saveState() {
    let { schemaDocument, attestation } = this.currentModel;

    attestation.set('document', schemaDocument.dump({ excludeInvalid: true }));
    attestation.setUser(this.session.get('currentUser'));
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