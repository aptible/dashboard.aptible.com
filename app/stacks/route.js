import Ember from 'ember';

export default Ember.Route.extend({
  afterModel() {
    let stacks = this.modelFor('dashboard').stacks;
    let stack = stacks.objectAt(0);
    let currentUserRoles = this.modelFor('dashboard').currentUserRoles;
    let organizations = this.modelFor('dashboard').organizations;
    let organization = organizations.objectAt(0);

    // Check for organization
    if (!organization) {
      this.transitionTo('no-organization');
    }
    // Check for platform / compliance roles
    if (this.session.get('currentUser').complianceRolesOnly(currentUserRoles, organization)) {
      this.transitionTo('settings.profile');
    }
    else {
      if (stacks.get('length') === 0) {
        this.transitionTo('no-stack');
      } else if (stack.get('activated')) {
        this.transitionTo('apps', stack);
      } else {
        this.transitionTo('stack.activate', stack);
      }
    }
  }
});
