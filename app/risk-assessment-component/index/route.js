import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let riskAssessment = this.modelFor('risk-assessment');
    let component = this.modelFor('risk-assessment-component');

    return  { riskAssessment, component };
  }
});
