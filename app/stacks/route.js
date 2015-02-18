import Ember from 'ember';

export default Ember.Route.extend({
  afterModel: function(stacks) {
    if(stacks.get('length') === 1) {
      this.transitionTo('stack.apps.index', stacks.get('firstObject'));
    }
  },
  model: function(){
    return this.store.find('stack');
  }
});
