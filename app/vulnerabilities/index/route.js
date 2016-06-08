import Ember from 'ember';

export default Ember.Route.extend({
  title: function(tokens) {
    let riskAssessment = this.modelFor('risk-assessment');
    let status = riskAssessment.get('status').capitalize();

    return `Vulnerabilities - ${status} Risk Assessment`
  },

  model() {
    return this.modelFor('risk-assessment.vulnerabilities');
  }
});
