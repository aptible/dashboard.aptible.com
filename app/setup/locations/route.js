import Ember from 'ember';
import Property from 'ember-json-schema-document/models/property';
import SPDRouteMixin from 'diesel/mixins/routes/spd-route';
import Attestation from 'diesel/models/attestation';
import loadSchema from 'diesel/utils/load-schema';

export default Ember.Route.extend(SPDRouteMixin, {
  model() {
    let handle = 'workforce_locations';
    let organizationUrl = this.modelFor('compliance-organization').get('data.links.self');

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
    controller.set('document', schemaDocument);
    controller.set('attestation', attestation);
    controller.set('locationProperty', new Property(schema._schema.items));
  },

  actions: {
    onNext() {
      let { schemaDocument, attestation } = this.currentModel;
      let profile = this.modelFor('setup');

      attestation.set('document', schemaDocument.dump({ excludeInvalid: true }));
      attestation.setUser(this.session.get('currentUser'));
      attestation.save().then(() => {
        profile.next(this.get('stepName'));
        return profile.save().then(() => {
          this.transitionTo(`setup.${profile.get('currentStep')}`);
        });
      }).catch((e) => {
        let message = Ember.getWithDefault(e, 'responseJSON.message', 'An error occured');
        Ember.get(this, 'flashMessages').danger(`Save Failed! ${message}`);
      });
    },

    onAddLocation() {
      this.controller.addNewLocation();
    },

    onCreateLocation() {
      let { schemaDocument, attestation } = this.currentModel;

      attestation.set('document', schemaDocument.dump({ excludeInvalid: true }));
      attestation.setUser(this.session.get('currentUser'));
      attestation.save();
    }
  }
});