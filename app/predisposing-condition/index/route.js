import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('predisposing-condition');
  },

  setupController(controller, model) {
    controller.set('model', model.predisposingCondition);
    controller.set('riskAssessment', model.riskAssessment);
  }
});
