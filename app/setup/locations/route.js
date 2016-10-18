import Ember from 'ember';
import Property from 'ember-json-schema-document/models/property';
import SPDRouteMixin from 'diesel/mixins/routes/spd-route';
import Attestation from 'diesel/models/attestation';
import loadSchema from 'diesel/utils/load-schema';

export default Ember.Route.extend(SPDRouteMixin, {
  model() {
    let organizationProfile = this.modelFor('setup');
    let handle = 'workforce_locations';

    return loadSchema(handle).then((schema) => {
      let attestationParams = { handle, schemaId: schema.id, document: [],
                                organizationProfile };
      let attestation = Attestation.findOrCreate(attestationParams, this.store);
      let schemaDocument = schema.buildDocument();

      return Ember.RSVP.hash({ schema, attestation, schemaDocument });
    });
  },

  setupController(controller, model) {
    let { schemaDocument, schema, attestation } = model;
    let organization = this.get('complianceStatus.organization');
    let locationProperty = new Property(schema._schema.items);

    controller.setProperties({ schema, schemaDocument, attestation,
                               organization, locationProperty });
  },

  actions: {
    onNext() {
      let { schemaDocument, attestation } = this.currentModel;
      let profile = this.modelFor('setup');

      attestation.set('document', schemaDocument.dump({ excludeInvalid: true }) || []);
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

    onRemoveLocation(location) {
      let { schemaDocument } = this.currentModel;
      schemaDocument.removeObject(location);
    },

    onCreateLocation() {
      let { schemaDocument, attestation } = this.currentModel;

      attestation.set('document', schemaDocument.dump({ excludeInvalid: true }));
      attestation.setUser(this.session.get('currentUser'));
      attestation.save();
    }
  }
});
