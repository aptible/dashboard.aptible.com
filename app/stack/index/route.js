import Ember from 'ember';

export default Ember.Route.extend({
  redirect() {
    let stack = this.modelFor('stack');

    if (!stack.get('activated')) {
      return this.transitionTo('stack.activate');
    }

    if(this.get('authorization').checkAbility('read', stack)) {
      this.transitionTo('apps');
    }
  }
});
