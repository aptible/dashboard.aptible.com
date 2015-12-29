import Ember from 'ember';
import SPDRouteMixin from 'sheriff/mixins/routes/spd-route';
import Attestation from 'sheriff/models/attestation';
import loadSchema from 'sheriff/utils/load-schema';

export default Ember.Route.extend(SPDRouteMixin, {
  model() {
    let handle = 'selected_data_environments';
    let organization = this.modelFor('organization').get('data.links.self');

    return loadSchema(handle).then((schema) => {
      let attestationParams = { handle, schemaId: schema.id, organization,
                                document: {} };
      let attestation = Attestation.findOrCreate(attestationParams, this.store);
      let schemaDocument = schema.buildDocument();

      return Ember.RSVP.hash({ schema, attestation, schemaDocument });
    });
  },

  setupController(controller, model) {
    controller.set('model', model.schema);
    controller.set('schemaDocument', model.schemaDocument);
    controller.set('attestation', model.attestation);
  },

  actions: {
    onNext() {
      let { attestation, schemaDocument } = this.currentModel;
      let profile = this.modelFor('setup');
      let selectedDataEnvironments = schemaDocument.dump({ excludeInvalid: true });

      attestation.set('document', selectedDataEnvironments);
      attestation.save().then(() => {
        profile.next(this.get('stepName'));
        profile.save().then(() => {
          this.transitionTo(`setup.${profile.get('currentStep')}`);
        });
      });
    }
  }
});
