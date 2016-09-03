import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let context = this.modelFor('organization');
    let organization = context.get('organization');
    return this.store.findStacksFor(organization);
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('organization', this.modelFor('organization').get('organization'));
  }
});
