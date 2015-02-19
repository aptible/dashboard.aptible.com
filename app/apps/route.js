import Ember from 'ember';

export default Ember.Route.extend({
  title: function(){
    var stack = this.modelFor('stack');
    return `${stack.get('handle')} Apps - ${stack.get('organization.name')}`;
  },
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
