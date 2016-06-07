import Ember from 'ember';

function titleize(type) {
  return type.split('_').map((w) => w.capitalize()).join(' ')
}

export default Ember.Route.extend({
  model(params) {
    let riskAssessment = this.modelFor('risk-assessment');

    let components = [];
    let typeStore = riskAssessment.get('graph')[params.node_type];
    let title = titleize(params.node_type);

    // All types in the risk graph are objects keyed by a unique handle.
    // Convert the objects to arrays and decorate each component with
    // a reference to the risk assessment id and node type

    for(var componentHandle in typeStore) {
      let component = typeStore[componentHandle];

      component.risk_assessment_id = riskAssessment.get('id');
      component.node_type = params.node_type;
      components.push(component);
    };

    return { riskAssessment, components, title };
  }
});
