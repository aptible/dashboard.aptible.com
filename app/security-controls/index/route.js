import Ember from 'ember';

export default Ember.Route.extend({
  title: function(tokens) {
    let riskAssessment = this.modelFor('risk-assessment');
    let status = riskAssessment.get('status').capitalize();

    return `Security Controls - ${status} Risk Assessment`
  },

  model() {
    return this.modelFor('security-controls');
  }
});
