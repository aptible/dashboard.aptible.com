import Ember from 'ember';
import Role from 'diesel/models/role';

export const DEFAULT_TRAINING_ROLE_NAME = 'Training-Only Users';
export const DEFAULT_DEVELOPER_ROLE_NAME = 'Developers';
export const DEFAULT_ADMIN_ROLE_NAME = 'Compliance Owners';

const TRAINING_ROLE_DESCRIPTION = `Users in this role have no Aptible 
                                   permissions. Use it for workforce members
                                   who need Basic Privacy & Security Training,
                                   but do not need to access or manage any
                                   other Aptible functions.`;

const ADMIN_ROLE_DESCRIPTION = `Users in this role can add/delete compliance
                                roles, risk assessments, policies, procedures,
                                and security controls.`;

export default Ember.Route.extend({
  complianceStatus: Ember.inject.service(),
  model() {
    let complianceStatus = this.get('complianceStatus');
    let { organization, invitations, users, roles } = complianceStatus.getProperties('organization', 'invitations', 'users', 'roles');
    let trainingOnlyRole = Role.findOrCreate({ organization,
                                               name: DEFAULT_TRAINING_ROLE_NAME,
                                               type: 'compliance_user' }, this.store);

    let adminRole = Role.findOrCreate({ organization,
                                        name: DEFAULT_ADMIN_ROLE_NAME,
                                        type: 'compliance_owner' }, this.store);

    return Ember.RSVP.hash({
      trainingOnlyRole, adminRole, organization, invitations, users, roles
    });
  },

  setupController(controller, model) {
    model.trainingOnlyRole.set('description', TRAINING_ROLE_DESCRIPTION);
    model.adminRole.set('description', ADMIN_ROLE_DESCRIPTION);

    controller.set('model', model);
    controller.set('roles', model.roles);
    controller.set('organization', model.organization);
  },

  actions: {
    resendInvitation(invitation) {
      let reset = this.store.createRecord('reset', { type: 'invitation' });
      reset.setProperties({ invitationId: invitation.get('id') });

      reset.save().then(() => {
        let message = `Invitation resent to ${invitation.get('email')}`;
        Ember.get(this, 'flashMessages').success(message);
      }).catch((e) => {
        let errorMessage = 'An error occurred. Please try resending the inviation again.';
        errorMessage = Ember.get(e, 'responseJSON.message') || errorMessage;
        Ember.get(this, 'flashMessages').danger(errorMessage);
      });
    },

    deleteInvitation(invitation) {
      let confirmMsg = `\nAre you sure you want to delete the invitation to ${invitation.get('email')}?\n`;
      if (!confirm(confirmMsg)) {
        return false;
      }

      invitation.destroyRecord().then(() => {
        let message = `The invitation to ${invitation.get('email')} has been removed.`;
        Ember.get(this, 'flashMessages').success(message);
      }).catch((e) => {
        let errorMessage = 'An error occurred. Please retry removing the inviation.';
        errorMessage = Ember.get(e, 'responseJSON.message') || errorMessage;
        Ember.get(this, 'flashMessages').danger(errorMessage);
      });
    },

    removeMember(membership, role) {
      let confirmMsg = `\nAre you sure you want to remove ${membership.get('user.name')} from ${role.get('name')}?\n`;

      if (!confirm(confirmMsg)) {
        return false;
      }

      if(membership) {
        membership.destroyRecord();
        role.get('users').removeObject(membership.get('user'));
      }
    },

    addMember(user, role) {
      Ember.assert('Must pass a user to `addMember`', user);
      Ember.assert('Must pass a role to `addMember`', role);

      let userUrl = user.get('data.links.self');

      let membership = this.store.createRecord('membership', {
        role, user, userUrl
      });

      if(role.get('isNew')) {
        role.save().then(() => {
          membership.save().then(() => {
            role.get('users').pushObject(user);
          });
        });
      } else {
        membership.save().then(() => {
          role.get('users').pushObject(user);
        });
      }

    },

    showInviteModal() {
      this.controller.showInviteModal();
    },

    inviteTeam(inviteList, role) {
      Ember.assert('Must pass inviteList to `inviteTeam`', inviteList);
      Ember.assert('Must pass a role to `inviteTeam`', role);

      let organization = this.modelFor('gridiron-organization').get('organization');

      role.save().then(() => {
        inviteList.map((email) => {
          let inviteParams = { organization, role, email };
          let invite = this.store.createRecord('invitation', inviteParams);
          organization.get('invitations').pushObject(invite);
          invite.save();
        });
      });
    }
  }
});
