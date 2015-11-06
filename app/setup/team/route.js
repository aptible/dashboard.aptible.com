import Ember from 'ember';
import Schema from 'ember-json-schema/models/schema';
import teamSchema from 'sheriff/schemas/team';

export default Ember.Route.extend({
  model() {
    let schema = new Schema(teamSchema);
    let attestation = this.store.createRecord('attestation', { handle: 'team' });
    let organization = this.modelFor('organization');

    return Ember.RSVP.hash({
      users: organization.get('users'),
      invitations: organization.get('invitations'),
      securityOfficer: organization.get('securityOfficer'),
      schema: schema,
      schemaDocument: schema.buildDocument(),
      attestation: attestation
    });
  },

  setupController(controller, model) {
    controller.set('users', model.users);
    controller.set('invitations', model.invitations);
    controller.set('schemaDocument', model.schemaDocument);
  },

  actions: {
    onNext(nextPath) {
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
