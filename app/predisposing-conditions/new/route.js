import Ember from 'ember';

export default Ember.Route.extend({
  title: function(tokens) {
    let riskAssessment = this.modelFor('risk-assessment');
    let status = riskAssessment.get('status').capitalize();

    return `Create Predisposing Condition - ${status} Risk Assessment`
  },

  model() {
    return this.store.createRecord('predisposingCondition');
  }
});
