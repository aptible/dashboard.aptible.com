import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    let organization = this.modelFor('organization');
    return organization.get('invitations');
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

    destroyInvitation(invitation){
      invitation.destroyRecord().then(() => {
        let message = `Deleted invitation for ${invitation.get('email')}`;
        this.controller.set('successMessage', message);
      });
    }
  }
});
