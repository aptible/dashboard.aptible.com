import Ember from "ember";

export default Ember.Controller.extend({
  queryParams: ['plan'],
  plan: null,
  planBinding: 'model.plan'
});

