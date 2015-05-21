import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.find('stack');
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('organization', this.modelFor('organization'));
  }
});
