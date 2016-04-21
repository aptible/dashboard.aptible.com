import Ember from 'ember';

export default Ember.Route.extend({
  redirect() {
    this.transitionTo('stacks');
  },

  model() {
    return this.store.find('organization');
  },

  afterModel(model) {
    return this.transitionTo('training', model.get('firstObject'));
  }
});
