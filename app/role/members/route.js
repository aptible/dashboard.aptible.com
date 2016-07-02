import Ember from 'ember';

export default Ember.Route.extend({
  afterModel(model) {
    let organization = model.get('organization');
    const promises = [];

    promises.push(model.get('users'));
    promises.push(model.get('organization'));
    promises.push(model.get('invitations'));
    promises.push(model.get('members'));
    promises.push(model.get('memberships'));
    promises.push(organization.get('users'));

    return Ember.RSVP.all(promises);
  },

  setupController(controller, model) {
    controller.set('model', model.get('memberships'));
    controller.set('role', model);
    controller.set('platform', model.get('platform'));
    controller.set('pendingInvitations', model.get('invitations'));
    controller.set('organization', model.get('organization'));
  },

  actions: {
    inviteUser(user){
      const role = this.currentModel;
      const userLink = user.get('data.links.self');
      const membership = this.store.createRecord('membership', {
        role,
        userUrl: userLink
      });

      membership.save().then(() => {
        let message = `${user.get('name')} added to ${role.get('name')} role`;
        Ember.get(this, 'flashMessages').success(message);
        return this.currentModel.get('users').reload();
      });
    },

    inviteByEmail(email) {
      let role = this.currentModel;
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

    removeUser(user){
      let role = this.currentModel;
      let userLink = user.get('data.links.self');

      role.get('memberships').then((memberships) => {
        let membership = memberships.findBy('data.links.user', userLink);
        return membership.destroyRecord();
      }).then(() => {
        let message = `${user.get('name')} removed from ${role.get('name')} role`;
        Ember.get(this, 'flashMessages').success(message);
        return this.currentModel.get('users').reload();
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
