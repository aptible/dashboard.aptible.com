import Ember from "ember";

export default Ember.Controller.extend({
  nonmembers: Ember.computed('role.users.[]', 'organization.users.[]', function() {
    const members = this.get('role.users');
    const organizationUsers = this.get('organization.users');
    return organizationUsers.reject((user) => {
      return members.contains(user);
    });
  }),

  canManageMemberships: Ember.computed('session.currentUser.roles', 'session.currentUser.memberships', function() {
    let currentUser = this.session.get('currentUser');
    let currentUserRoles = this.get('currentUserRoles');
    let role = this.get('role');
    let organization = this.get('organization');
    let membership = currentUser.findMembership(role.get('memberships'));

    // True if
    //    - current user is an account owner
    //    - the role type is platform (user or owner) and the currentUser is a
    //      member of the platform_owner or owner roles
    //    - the role type is compliance (user or owner) and the currentUser is
    //      a member of the compliance_owner or owner roles
    //    - current user has a privileged membership of this role
    return (currentUser.isAccountOwner(currentUserRoles, organization) ||
            (role.get('isPlatform') &&
              currentUser.isPlatformOwner(currentUserRoles, organization)) ||
            (role.get('isCompliance') &&
              currentUser.isComplianceOwner(currentUserRoles, organization)) ||
            (!!membership && membership.get('privileged')));
  })
});
