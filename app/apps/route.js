import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    var stack = this.modelFor('stack');
    var apps = stack.get('apps');
    if (apps.get('isFulfilled')) {
      return apps.reload();
    } else {
      return apps;
    }
  }
});
