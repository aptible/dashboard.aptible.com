import Ember from 'ember';

// Compliance Dashboard
// Criterion:
// policy_manual
// risk_assessment
// app_security_interview
// training_log
// developer_training_log
// security_officer_training_log
//
export default Ember.Route.extend({
  model() {
    return this.store.find('criterion').then((criteria) => {
      debugger;
      return Ember.RSVP.hash({
        policyManual: criteria.findBy('handle', 'policy_manual'),
        riskAssessment: criteria.findBy('handle', 'risk_assessment'),
        appSecurityInterview: criteria.findBy('app_security_interview'),
        trainingLog: criteria.findBy('training_log')
      })
    })
  },
  afterModel(model) {
    debugger;
  }
});
