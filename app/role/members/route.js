import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let role = this.modelFor('role');

    return Ember.RSVP.hash({
      role: role,
      memberships: role.get('memberships'),
      currentUserRoles: this.session.get('currentUser.roles')
    });
  },

  afterModel(model) {
    let organization = model.role.get('organization');
    const promises = [];

    promises.push(model.role.get('users'));
    promises.push(model.role.get('organization'));
    promises.push(model.role.get('invitations'));
    promises.push(organization.get('users'));

    return Ember.RSVP.all(promises);
  },

  setupController(controller, model) {
    controller.set('role', model.role);
    controller.set('memberships', model.memberships);
    controller.set('platformRole', model.role.get('platform'));
    controller.set('pendingInvitations', model.role.get('invitations'));
    controller.set('organization', model.role.get('organization'));
    controller.set('currentUserRoles', model.currentUserRoles);
  },

  // Note: Memberships are removed by the membership table row component
  actions: {
    addMember(user){
      if (!user) { return; }
      const role = this.controller.get('role');
      const userLink = user.get('data.links.self');
      const membership = this.store.createRecord('membership', {
        role,
        userUrl: userLink
      });

      membership.save().then(() => {
        let message = `${user.get('name')} added to ${role.get('name')} role`;
        this.controller.set('invitedUser', '');
        Ember.get(this, 'flashMessages').success(message);
        return this.get('controller').set('memberships', role.get('memberships').reload());
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
