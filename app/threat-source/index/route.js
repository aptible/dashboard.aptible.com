import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('threat-source');
  },

  setupController(controller, model) {
    controller.set('model', model.threatSource);
    controller.set('riskAssessment', model.riskAssessment);
  }
});
