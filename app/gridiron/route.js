import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('authorization').load();
  },

  redirect(authorization) {
    if (!authorization.get('hasAnyOrganizationsWithGridironProduct')) {
      this.transitionTo('enclave');
    }
  }
});
