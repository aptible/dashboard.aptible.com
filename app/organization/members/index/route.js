import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    let organization = this.modelFor('organization');

    return Ember.RSVP.hash({
      organization: organization,
      users: organization.get('users')
    });
  },

  afterModel(model){
    // FIXME: This causes way too many queries. Users should have roles embedded.
    return Ember.RSVP.hash({
      invitations: model.organization.get('invitations'),
      roles: model.users.map(u => u.get('roles'))
    });
  },

  setupController(controller, model){
    controller.set('model', model.users);
    controller.set('organization', model.organization);
  },

  actions: {
    resentInvitation(invitation){
      let successMessage = `Re-sent invitation to ${invitation.get('email')}`;
      Ember.get(this, 'flashMessages').success(successMessage);
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
    },

    destroyInvitation(invitation){
      invitation.destroyRecord().then(() => {
        let message = `Deleted invitation for ${invitation.get('email')}`;
        Ember.get(this, 'flashMessages').success(message);
      });
    },

    // sent by the bs-alert component when it is dismissed
    clearSuccessMessage(){
      this.controller.set('successMessage', null);
    }
  }
});
