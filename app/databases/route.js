import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    var stack = this.modelFor('stack');
    var databases = stack.get('databases');
    if (databases.get('isFulfilled')) {
      return databases.reload();
    } else {
      return databases;
    }
  }
});
