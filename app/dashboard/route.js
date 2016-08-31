import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('authorization').load();
  },

  setupController(controller, model) {
    controller.set('authorizationContexts', model.get('organizationContexts'));
  }
});
