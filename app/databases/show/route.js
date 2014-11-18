import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params){
    return {handle: params.database_id, id: params.database_id};
  }
});
