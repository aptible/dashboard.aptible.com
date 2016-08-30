import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('stack');
  },

  redirect() {
    let stack = this.modelFor('stack');

    if(stack.get('activated')) {
      this.transitionTo('apps');
    }
  }
});
