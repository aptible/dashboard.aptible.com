import Ember from 'ember';

export default Ember.Route.extend({
  title: function(tokens) {
    let riskAssessment = this.modelFor('risk-assessment');
    let status = riskAssessment.get('status').capitalize();

    return `Threat Events - ${status} Risk Assessment`
  },

  model() {
    return this.modelFor('threat-events');
  }
});
