import Ember from 'ember';

export default Ember.Route.extend({
  redirect() {
    let stack = this.modelFor('stack');

    if (!stack.get('activated')) {
      return this.transitionTo('stack.activate');
    }

    return this.get('session.currentUser').can('read', stack).then((permitted) => {
      if(permitted) {
        this.transitionTo('apps');
      }
    });
  }
});
