import Ember from 'ember';

export default Ember.Route.extend({
  authorization: Ember.inject.service(),

  redirect() {
    this.transitionTo('stacks');
  },

  model() {
    return this.get('authorization.organizations');
  }
});
