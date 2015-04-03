import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    let organization = this.modelFor('organization');
    return organization.get('users');
  },

  afterModel(model){
    // FIXME: This causes way too many queries. Users should have roles embedded.
    return Ember.RSVP.hash({
      invitations: model.get('invitations'),
      roles: model.map(u => u.get('roles'))
    });
  },

  setupController(controller, model){
    controller.set('model', model);
    controller.set('organization', this.modelFor('organization'));
  },

  actions: {
    resentInvitation(invitation){
      let successMessage = `Re-sent invitation to ${invitation.get('email')}`;
      this.controller.set('successMessage', successMessage);
    },

    resendInvitation(invitation){
      let reset = this.store.createRecord('reset');
      reset.setProperties({
        type: 'invitation',
        invitationId: invitation.get('id')
      });

      reset.save().then(() => {
        let message = `Invitation resent to ${invitation.get('email')}`;
        this.controller.set('successMessage', message);
      });
    },

    destroyInvitation(invitation){
      invitation.destroyRecord().then(() => {
        let message = `Deleted invitation for ${invitation.get('email')}`;
        this.controller.set('successMessage', message);
      });
    },

    // sent by the bs-alert component when it is dismissed
    clearSuccessMessage(){
      this.controller.set('successMessage', null);
    }
  }
});
