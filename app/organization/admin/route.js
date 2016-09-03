import Ember from 'ember';

export default Ember.Route.extend({
  redirect() {
    let context = this.modelFor('organization');

    if (!context.get('userIsOrganizationAdmin')) {
      let message = `Access Denied: You must be an organization owner in order to view that page`;
      Ember.get(this, 'flashMessages').danger(message);
      this.transitionTo('organization.members');
    }
  }
});
