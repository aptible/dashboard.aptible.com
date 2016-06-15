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
    controller.set('organization', model.organization);
  }
});
