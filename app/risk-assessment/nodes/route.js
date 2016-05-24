import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return {
      type: params.node_type,
      showNode: {
        risk_assessment_id: 1,
        node_type: params.node_type,
        handle: 'some-handle'
      }
    };
  }
});
