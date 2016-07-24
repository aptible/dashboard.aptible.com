import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let organization = this.modelFor('organization');

    return Ember.RSVP.hash({
      organization: organization,
      currentUserRoles: this.session.get('currentUser.roles')
    });
  },

  redirect(model) {
    let currentUser = this.session.get('currentUser');

    if (currentUser.complianceRolesOnly(model.currentUserRoles, model.organization)) {
      this.transitionTo('organization.roles.compliance');
      return;
    }
    this.transitionTo('organization.roles.platform');
  }
});
