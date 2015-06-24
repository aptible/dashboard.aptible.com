import Ember from 'ember';

export default Ember.Route.extend({
  afterModel(model) {
    return model.get('roles');
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('organizations', this.store.find('organization'));
  }
});
