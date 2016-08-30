import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('organization');
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('organization', model.get('organization'));
  }
});
