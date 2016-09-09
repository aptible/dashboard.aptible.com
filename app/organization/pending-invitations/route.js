import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('organization');
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('authorizationContext', model);
    controller.set('organization', model.get('organization'));
  },

  actions: {
    resendInvitation(invitation){
      debugger;
      let reset = this.store.createRecord('reset');
      reset.setProperties({
        type: 'invitation',
        invitationId: invitation.get('id')
      });

      reset.save().then(() => {
        let message = `Invitation resent to ${invitation.get('email')}`;
        this.transitionTo('organization.pending-invitations');
        Ember.get(this, 'flashMessages').success(message);
      });
    },

    destroyInvitation(invitation){
      invitation.destroyRecord().then(() => {
        let message = `Deleted invitation for ${invitation.get('email')}`;
        this.transitionTo('organization.pending-invitations');
        Ember.get(this, 'flashMessages').success(message);
      });
    },

    // sent by the bs-alert component when it is dismissed
    clearSuccessMessage(){
      this.controller.set('successMessage', null);
    }
  }
});
