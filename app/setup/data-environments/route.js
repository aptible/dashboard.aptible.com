import Ember from 'ember';
import SPDRouteMixin from 'sheriff/mixins/routes/spd-route';
import Schema from 'ember-json-schema/models/schema';
import Attestation from 'sheriff/models/attestation';
import dataEnvironmentsSchemaJson from 'sheriff/schemas/data-environments';

export default Ember.Route.extend(SPDRouteMixin, {
  model() {
    let dataEnvironmentsSchema = new Schema(dataEnvironmentsSchemaJson);
    let schemaDocument = dataEnvironmentsSchema.buildDocument();
    let organization = this.modelFor('organization');
    let store = this.store
    let attestation = Attestation.findOrCreate('data-environments',
                                               organization, [], store);
    return Ember.RSVP.hash({ dataEnvironmentsSchema, attestation,
                             schemaDocument });
  },

  setupController(controller, model) {
    controller.set('model', model.dataEnvironmentsSchema);
    controller.set('schemaDocument', model.schemaDocument);
    controller.set('attestation', model.attestation);
  },

  actions: {
    onNext() {
      let { attestation, schemaDocument } = this.currentModel;
      let profile = this.modelFor('setup');
      let selectedDataEnvironments = schemaDocument.toJSON();

      profile.setProperties({ selectedDataEnvironments });
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
