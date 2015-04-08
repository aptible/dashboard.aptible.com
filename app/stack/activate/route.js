import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.modelFor('stack');
  },
  redirect: function() {
    let stack = this.modelFor('stack');

    if(stack.get('activated')) {
      this.transitionTo('apps');
    }
  }
});
