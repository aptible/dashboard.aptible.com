import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('security-control');
  },

  setupController(controller, model) {
    controller.set('model', model.securityControl);
    controller.set('riskAssessment', model.riskAssessment);
  }
});
