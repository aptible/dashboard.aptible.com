import Ember from 'ember';

export default Ember.Route.extend({
  title: function() {
    let riskAssessment = this.modelFor('risk-assessment');
    let status = riskAssessment.get('status').capitalize();

    return `Threat Sources - ${status} Risk Assessment`;
  },

  model() {
    return this.modelFor('threat-sources');
  }
});
