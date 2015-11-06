import Ember from 'ember';
import Schema from 'ember-json-schema/models/schema';
import Property from 'ember-json-schema/models/property';
import locationsSchema from 'sheriff/schemas/locations';

// Use schema as property for validation
export var locationProperty = new Property(locationsSchema.items);

export default Ember.Route.extend({
  model() {
    let schema = new Schema(locationsSchema);
    let attestation = this.store.createRecord('attestation', { handle: 'locations'});

    return {
      schema: schema,
      schemaDocument: schema.buildDocument(),
      attestation: attestation
    };
  },

  afterModel() {
    let profile = this.modelFor('setup');

    if(!profile.isReadyForStep('locations')) {
      return this.transitionTo(`setup.${profile.get('currentStep')}`);
    }
  },

  setupController(controller, model) {
    let { schemaDocument, schema } = model;

    controller.set('model', schemaDocument);
    controller.set('locationSchema', schema);
  },

  actions: {
    onPrevious() {
      let profile = this.modelFor('setup');

      profile.previous();
      profile.save().then(() => {
        let previousPath = `setup.${profile.get('currentStep')}`;
        this.transitionTo(previousPath);
      });
    },

    onNext() {
      let { schemaDocument, attestation } = this.currentModel;
      let profile = this.modelFor('setup');

      attestation.set('document', schemaDocument);
      attestation.save().then(() => {
        profile.next();
        profile.save().then(() => {
          this.transitionTo(`setup.${profile.get('currentStep')}`);
        });
      });
    }
  }
});
