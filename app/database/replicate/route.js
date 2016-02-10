import Ember from 'ember';

export default Ember.Route.extend({
  titleToken: function(){
    var database = this.modelFor('database');
    return `Replicate ${database.get('handle')}`;
  }
});
