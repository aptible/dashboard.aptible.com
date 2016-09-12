import Ember from 'ember';

export default Ember.Route.extend({
  redirect() {
    this.transitionTo('stacks');
  },

  model() {
    return this.get('authorization.organizations');
  }
});
