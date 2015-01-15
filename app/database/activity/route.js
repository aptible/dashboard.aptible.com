import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    var database = this.modelFor('database');
    return database.get('operations');
  }

});
