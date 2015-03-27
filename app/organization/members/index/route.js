import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    let organization = this.modelFor('organization');
    return organization.get('users');
  },
  afterModel(model){
    // FIXME: This causes way too many queries. Users should have roles embedded.
    return Ember.RSVP.all(model.map(u => u.get('roles')));
  },

  setupController(controller, model){
    controller.set('model', model);
    controller.set('organization', this.modelFor('organization'));
  }
});
