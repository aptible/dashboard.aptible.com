import Ember from 'ember';
import Schema from 'ember-json-schema/models/schema';
import teamSchema from 'sheriff/schemas/team';
import SPDRouteMixin from 'sheriff/mixins/routes/spd-route';
import Attestation from 'sheriff/models/attestation';
import buildTeamDocument from 'sheriff/utils/build-team-document';

export default Ember.Route.extend(SPDRouteMixin, {
  model() {
    let schema = new Schema(teamSchema);
    let organization = this.modelFor('organization');
    let store = this.store;
    let attestation = Attestation.findOrCreate('team', organization, [], store);

    return Ember.RSVP.hash({
      users: organization.get('users'),
      invitations: organization.get('invitations'),
      securityOfficer: organization.get('securityOfficer'),
      schema,
      attestation: attestation
    });
  },

  setupController(controller, model) {
    let organization = this.modelFor('organization');
    let { schema, attestation, invitations, users } = model;
    let schemaDocument = buildTeamDocument(users, attestation.get('document'),
                                           schema);

    controller.set('users', model.users);
    controller.set('roles', organization.get('roles'));
    controller.set('organization', organization);
    controller.set('invitations', invitations);
    controller.set('schemaDocument', schemaDocument);
    controller.set('properties', schema.itemProperties);
  },

  actions: {
    onNext() {
      let { attestation } = this.currentModel;
      let profile = this.modelFor('setup');
      let document = this.controller.get('schemaDocument').dump();

      attestation.set('document', document);
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
