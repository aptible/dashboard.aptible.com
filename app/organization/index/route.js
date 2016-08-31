import Ember from 'ember';

export default Ember.Route.extend({
  redirect() {
    let context = this.modelFor('organization');
    this.transitionTo('organization.members', context);
  }
});
