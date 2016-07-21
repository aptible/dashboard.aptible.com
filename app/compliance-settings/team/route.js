import Ember from 'ember';
import Role from 'diesel/models/role';

export const DEFAULT_TRAINING_ROLE_NAME = 'Training Only Users';
export const DEFAULT_DEVELOPER_ROLE_NAME = 'Developers';
export const DEFAULT_ADMIN_ROLE_NAME = 'Compliance Admins';

const TRAINING_ROLE_DESCRIPTION = `Add users to this role who do not need
                                   access to manage any Aptible resources, but
                                   should still receive Basic HIPAA Training.`;

const DEVELOPER_ROLE_DESCRIPTION = `Any user with access to read or manage
                                    information systems should be assigned to
                                    this role.  Users in this role will be
                                    required to take Advanced HIPAA Training.`;

const ADMIN_ROLE_DESCRIPTION = `Users in this role can add/delete compliance
                                roles, risk assessments, policies, procedures,
                                and security controls.`;

export default Ember.Route.extend({
  attestationValidator: Ember.inject.service(),
  model() {
    let organization = this.modelFor('compliance-organization');
    let trainingOnlyRole = Role.findOrCreate({ organization,
                                               name: DEFAULT_TRAINING_ROLE_NAME,
                                               type: 'compliance_user' }, this.store);
    let developerRole = Role.findOrCreate({ organization,
                                            name: DEFAULT_DEVELOPER_ROLE_NAME,
                                            type: 'compliance_user' }, this.store);
    let adminRole = Role.findOrCreate({ organization,
                                        name: DEFAULT_ADMIN_ROLE_NAME,
                                        type: 'compliance_user' }, this.store);
    return Ember.RSVP.hash({
      trainingOnlyRole, developerRole, adminRole, organization,
      invitations: organization.get('invitations'),
      users: organization.get('users')
    });
  },

  setupController(controller, model) {
    let organization = this.modelFor('compliance-organization');
    model.trainingOnlyRole.set('description', TRAINING_ROLE_DESCRIPTION);
    model.developerRole.set('description', DEVELOPER_ROLE_DESCRIPTION);
    model.adminRole.set('description', ADMIN_ROLE_DESCRIPTION);

    controller.set('model', model)
    controller.set('actions', {
      resendInvitation: this.resendInvitation,
      removeInvitation: this.removeInvitation
    });
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
      attestation.setUser(this.session.get('currentUser'));
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
      let organization = this.modelFor('compliance-organization');
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
      let organization = this.modelFor('compliance-organization');
      let existingDocument = this.controller.get('schemaDocument').dump();
      let newSchemaDocument = buildTeamDocument(organization.get('users'),
                                                organization.get('invitations'),
                                                existingDocument,
                                                this.currentModel.schema);
      this.controller.set('schemaDocument', newSchemaDocument);
    }
  }
});
