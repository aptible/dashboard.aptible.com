import Ember from 'ember';
import Schema from 'ember-json-schema/models/schema';
import teamSchema from 'sheriff/schemas/team';
import SPDRouteMixin from 'sheriff/mixins/routes/spd-route';

export default Ember.Route.extend(SPDRouteMixin, {
  model() {
    let schema = new Schema(teamSchema);
    let organization = this.modelFor('organization');
    let attestation = this.store.createRecord('attestation', {
      handle: 'team', organization: organization.get('data.links.self')
    });

    return Ember.RSVP.hash({
      users: organization.get('users'),
      invitations: organization.get('invitations'),
      securityOfficer: organization.get('securityOfficer'),
      schemaDocument: schema.buildDocument(),
      attestation: attestation
    });
  },

  afterModel() {
    let profile = this.modelFor('setup');

    if(!profile.isReadyForStep('team')) {
      return this.transitionTo(`setup.${profile.get('currentStep')}`);
    }
  },

  setupController(controller, model) {
    let organization = this.modelFor('organization');

    controller.set('users', model.users);
    controller.set('roles', organization.get('roles'));
    controller.set('organization', organization);
    controller.set('invitations', model.invitations);
    controller.set('schemaDocument', model.schemaDocument);
  },

  actions: {
    onNext() {
      let { schemaDocument, attestation } = this.currentModel;
      let profile = this.modelFor('setup');

      attestation.set('document', schemaDocument);
      attestation.save().then(() => {
        profile.next(this.get('stepName'));
        profile.save().then(() => {
          this.transitionTo(`setup.${profile.get('currentStep')}`);
        });
      });
    },

    showInviteModal() {
      this.controller.set('showInviteModal', true);
    },

    inviteTeam(inviteList, roleId) {
      let organization = this.modelFor('organization');
      let role = organization.get('roles').findBy('id', roleId);

      inviteList.map((email) => {
        let inviteParams = { organization, role, email };
        return this.store.createRecord('invitation', inviteParams).save();
      });
    }
  }
});
