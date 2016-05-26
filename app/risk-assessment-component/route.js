import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    let riskAssessment = this.modelFor('risk-assessment');
    let components = riskAssessment[params.node_type]
    let component = components[params.handle]

    return  { riskAssessment, components, component };
  }
});
