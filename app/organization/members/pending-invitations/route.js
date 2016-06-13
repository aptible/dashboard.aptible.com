import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    let organization = this.modelFor('organization');

    return Ember.RSVP.hash({
      organization: organization,
      invitations: organization.get('invitations')
    });
  },

  setupController(controller, model){
    controller.set('invitations', model.invitations);
    controller.set('organization', model.organization);
  },

  actions: {
    resendInvitation(invitation){
      let reset = this.store.createRecord('reset');
      reset.setProperties({
        type: 'invitation',
        invitationId: invitation.get('id')
      });

      reset.save().then(() => {
        let message = `Invitation resent to ${invitation.get('email')}`;
        this.transitionTo('organization.members.pending-invitations');
        Ember.get(this, 'flashMessages').success(message);
      });
    },

    destroyInvitation(invitation){
      invitation.destroyRecord().then(() => {
        let message = `Deleted invitation for ${invitation.get('email')}`;
        this.transitionTo('organization.members.pending-invitations');
        Ember.get(this, 'flashMessages').success(message);
      });
    },

    // sent by the bs-alert component when it is dismissed
    clearSuccessMessage(){
      this.controller.set('successMessage', null);
    }
  }
});
