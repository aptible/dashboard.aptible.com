import Ember from 'ember';
import Attestation from 'sheriff/models/attestation';
import buildTeamDocument from 'sheriff/utils/build-team-document';
import loadSchema from 'sheriff/utils/load-schema';

export default Ember.Route.extend({
  attestationValidator: Ember.inject.service(),
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
    let schemaDocument = buildTeamDocument(users, invitations,
                                           attestation.get('document'), schema);

    controller.set('users', model.users);
    controller.set('roles', organization.get('roles'));
    controller.set('organization', organization);
    controller.set('invitations', invitations);
    controller.set('schemaDocument', schemaDocument);
    controller.set('properties', schema.itemProperties);
    controller.set('actions', {
      resendInvitation: this.resendInvitation,
      removeInvitation: this.removeInvitation
    });
  },

  afterModel(model) {
    if(model.schemaDocument && model.attestation) {
      model.schemaDocument.load(model.attestation.get('document'));
    }
  },

  validateAttestation(schemaDocument) {
    let { attestation } = this.currentModel;
    let errors = this.get('attestationValidator').validate(attestation, schemaDocument);

    this.controller.set('errors', errors);

    return errors;
  },

  resendInvitation(email) {
    let reset = this.store.createRecord('reset');
    let invitation = this.invitations.findBy('email', email);
    let message = `Invitation resent to ${email}`;
    let errorMessage = 'An error occurred. Please try resending the inviation again.';

    reset.setProperties({
      type: 'invitation',
      invitationId: invitation.get('id')
    });
    reset.save().then(() => {
      Ember.get(this, 'flashMessages').success(message);
    }).catch((e) => {
      errorMessage = Ember.get(e, 'responseJSON.message') || errorMessage;
      Ember.get(this, 'flashMessages').danger(errorMessage);
    });
  },

  removeInvitation(email) {
    let invitation = this.invitations.findBy('email', email);
    let message = `The invitation to ${invitation.get('email')} has been removed.`;
    let errorMessage = 'An error occurred. Please retry removing the inviation.';

    // Confirm...
    let confirmMsg = `\nAre you sure you want to delete the invitation to ${email}?\n`;
    if (!confirm(confirmMsg)) { return false; }

    invitation.destroyRecord().then(() => {
      this.send('onRemoveInvitation', invitation);
      Ember.get(this, 'flashMessages').success(message);
    }).catch((e) => {
      errorMessage = Ember.get(e, 'responseJSON.message') || errorMessage;
      Ember.get(this, 'flashMessages').danger(errorMessage);
    });
  },


  actions: {
    save() {
      let { attestation } = this.currentModel;
      let schemaDocument = this.controller.get('schemaDocument').dump();

      this.validateAttestation(schemaDocument);

      if (this.controller.get('errors.length') > 0) {
        return;
      }

      attestation.set('document', schemaDocument);
      attestation.save().then(() => {
        let message = 'Workforce saved.';
        Ember.get(this, 'flashMessages').success(message);
      }, (e) => {
        let message = Ember.getWithDefault(e, 'responseJSON.message', 'An error occured');
        Ember.get(this, 'flashMessages').danger(`Save Failed! ${message}`);
      });
    },

    showInviteModal() {
      this.controller.showInviteModal();
    },

    inviteTeam(inviteList, roleId) {
      let organization = this.modelFor('organization');
      let role = organization.get('roles').findBy('id', roleId);

      inviteList.map((email) => {
        let inviteParams = { organization, role, email };
        return this.store.createRecord('invitation', inviteParams).save();
      });

      let existingDocument = this.controller.get('schemaDocument').dump();
      let newSchemaDocument = buildTeamDocument(organization.get('users'),
                                                organization.get('invitations'),
                                                existingDocument,
                                                this.currentModel.schema);
      this.controller.set('schemaDocument', newSchemaDocument);
      this.controller.set('showInviteMOdal', false);
    },

    onRemoveInvitation() {
      let organization = this.modelFor('organization');
      let existingDocument = this.controller.get('schemaDocument').dump();
      let newSchemaDocument = buildTeamDocument(organization.get('users'),
                                                organization.get('invitations'),
                                                existingDocument,
                                                this.currentModel.schema);
      this.controller.set('schemaDocument', newSchemaDocument);
    }
  }
});
