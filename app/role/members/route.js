import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('role');
  },

  setupController(controller, model) {
    let contextHref = model.get('data.links.organization');
    let context = this.get('authorization').getContextByHref(contextHref);
    let { organization, currentUserRoles } = context;
    let canManageMemberships = context.canUserInviteIntoRole(model);

    controller.set('role', model);
    controller.set('memberships', model.get('memberships'));
    controller.set('pendingInvitations', model.get('invitations'));
    controller.setProperties({ context, organization, currentUserRoles, canManageMemberships });
  },

  actions: {
    completedAction(message) {
      Ember.get(this, 'flashMessages').success(message);
    },

    failedAction(message) {
      Ember.get(this, 'flashMessages').danger(message);
    },

    addMember() {
      const user = this.controller.get('invitedUser');
      if (!user) { return; }

      const role = this.controller.get('role');
      const userUrl = user.get('data.links.self');
      const membership = this.store.createRecord('membership', { role, userUrl, user });

      membership.save().then(() => {
        let message = `${user.get('name')} added to ${role.get('name')}`;

        role.get('users').pushObject(user);
        role.get('memberships').pushObject(membership);

        this.controller.set('invitedUser', '');
        Ember.get(this, 'flashMessages').success(message);
      });
    },

    inviteByEmail(email) {
      let role = this.controller.get('role');
      let invitation = this.controller.get('invitation');
      if (invitation) {
        invitation.set('email', email);
      } else {
        invitation = this.store.createRecord('invitation', {
          email,
          role
        });
        this.controller.set('invitation', invitation);
      }
      invitation.save().then(() => {
        this.controller.set('invitation', null);
        this.controller.set('invitedEmail', '');
        let message = `Invitation sent to ${email}`;
        Ember.get(this, 'flashMessages').success(message);
      }, (e) => {
        if (!(e instanceof DS.InvalidError)) {
          throw e;
        }
      });
    },

    destroyInvitation(invitation){
      invitation.destroyRecord().then(() => {
        let message = `Invitation to ${invitation.get('email')} destroyed`;
        Ember.get(this, 'flashMessages').success(message);
      });
    },

    resendInvitation(invitation){
      let reset = this.store.createRecord('reset');
      reset.setProperties({
        type: 'invitation',
        invitationId: invitation.get('id')
      });
      reset.save().then(() => {
        let message = `Invitation resent to ${invitation.get('email')}`;
        Ember.get(this, 'flashMessages').success(message);
      });
    }
  }
});
