import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params){
    return {handle: params.app_id, id: params.app_id};
  }
});
