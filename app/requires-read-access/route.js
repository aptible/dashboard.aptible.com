import Ember from 'ember';

export default Ember.Route.extend({
  redirect() {
    if (!this.features.get('trainee-dashboard')) {
      return;
    }

    let organizations = this.modelFor('dashboard').organizations;
    let userRoles = this.modelFor('dashboard').currentUserRoles;

    // Does the user have any roles for any organization that are not compliance user?
    let complianceOnlyUser = !organizations.any((organization) => {
      let organizationHref = organization.get('data.links.self');
      let userOrganizationRoles = userRoles.filterBy('data.links.organization', organizationHref);

      // Does the user have any roles that are not compliance user?
      return userOrganizationRoles.any((role) => {
        return role.get('type') !== 'compliance_user';
      });
    });

    if(complianceOnlyUser) {
      this.transitionTo('trainee-dashboard');
    }
  }
});
