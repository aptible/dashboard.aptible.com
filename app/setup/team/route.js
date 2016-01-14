import Ember from 'ember';
import SPDRouteMixin from 'sheriff/mixins/routes/spd-route';
import Attestation from 'sheriff/models/attestation';
import buildTeamDocument from 'sheriff/utils/build-team-document';
import loadSchema from 'sheriff/utils/load-schema';

export default Ember.Route.extend(SPDRouteMixin, {
  model() {
    let handle = 'workforce_roles';
    let organization = this.modelFor('organization');
    let organizationUrl = organization.get('data.links.self');

    return loadSchema(handle).then((schema) => {
      let attestationParams = { handle, schemaId: schema.id, document: [],
                                organizationUrl };

      let attestation = Attestation.findOrCreate(attestationParams, this.store);

      return Ember.RSVP.hash({
        schema, attestation,
        users: organization.get('users'),
        invitations: organization.get('invitations'),
        securityOfficer: organization.get('securityOfficer')
      });
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
      let schemaDocument = this.controller.get('schemaDocument');

      attestation.set('document', schemaDocument.dump());
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
