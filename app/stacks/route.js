import Ember from 'ember';

export default Ember.Route.extend({
  afterModel: function(){
    var stacks = this.modelFor('dashboard').stacks;
    var stack = stacks.objectAt(0);

    if(stacks.get('length') === 0) {
      this.transitionTo('welcome.first-app');
    } else if (stack.get('activated')) {
      this.transitionTo('apps', stack);
    } else {
      this.transitionTo('stack.activate', stack);
    }
  }
});
