import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let organization = this.modelFor('organization');
    return this.store.findStacksFor(organization);
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('organization', this.modelFor('organization'));
  }
});
