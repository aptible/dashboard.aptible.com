import Ember from 'ember';

export default Ember.Route.extend({
  redirect() {
    let authorization = this.get('authorization');
    let organizationId = authorization.get('organizationContexts.firstObject.organization.id');
    this.transitionTo('gridiron-admin', organizationId);
  }
});
