import Ember from 'ember';

export default Ember.Route.extend({
  redirect(authorization) {
    if (!authorization.get('hasAnyOrganizationsWithGridironProduct')) {
      this.transitionTo('enclave');
    }
  }
});
