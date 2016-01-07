import Ember from 'ember';
import Property from 'ember-json-schema/models/property';
import SPDRouteMixin from 'sheriff/mixins/routes/spd-route';
import Attestation from 'sheriff/models/attestation';
import loadSchema from 'sheriff/utils/load-schema';

// Use schema as property for validation
export var locationProperty;

export default Ember.Route.extend(SPDRouteMixin, {
  model() {
    let handle = 'workforce_locations';
    let organizationUrl = this.modelFor('organization').get('data.links.self');

    return loadSchema(handle).then((schema) => {
      let attestationParams = { handle, schemaId: schema.id, organizationUrl,
                                document: [] };
      let attestation = Attestation.findOrCreate(attestationParams, this.store);
      let schemaDocument = schema.buildDocument();

      locationProperty = new Property(schema._schema.items);

      return Ember.RSVP.hash({ schema, attestation, schemaDocument });
    });
  },

  setupController(controller, model) {
    let { schemaDocument, schema } = model;

    controller.set('schema', schema);
    controller.set('document', schemaDocument);
  },

  actions: {
    onNext() {
      let { schemaDocument, attestation } = this.currentModel;
      let profile = this.modelFor('setup');

      attestation.set('document', schemaDocument.dump({ excludeInvalid: true }));
      attestation.save().then(() => {
        profile.next(this.get('stepName'));
        profile.save().then(() => {
          this.transitionTo(`setup.${profile.get('currentStep')}`);
        });
      });
    },

    onAddLocation() {
      let newLocation = this.controller.get('document').addItem();
      this.controller.setProperties({ newLocation });
    }
  }
});