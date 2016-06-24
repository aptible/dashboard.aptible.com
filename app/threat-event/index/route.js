import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('threat-event');
  },

  setupController(controller, model) {
    controller.set('model', model.threatEvent);
    controller.set('riskAssessment', model.riskAssessment);
  }
});
