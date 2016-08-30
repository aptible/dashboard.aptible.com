import Ember from 'ember';

export default Ember.Route.extend({
  redirect() {
    let currentStack = this.get('authorization.stacks.firstObject');

    if (currentStack.get('activated')) {
      this.transitionTo('apps', currentStack);
    } else {
      this.transitionTo('stack.activate', currentStack);
    }
  },

  model() {
    return this.get('authorization.stacks');
  }
});
