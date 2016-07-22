import Ember from 'ember';

export default Ember.Component.extend({
  showNav: Ember.computed('currentUser.roles.[]', 'billingDetail.allowPHI', function() {
    const organizationUrl = this.get('organization.data.links.self');
    let platformRoles = [];
    let complianceRoles = [];
    let roles = this.get('currentUserRoles');

    roles.filterBy('data.links.organization', organizationUrl).forEach((role) => {
      if (role.get('isPlatformOwner') || role.get('isPlatformUser')) {
        platformRoles.push(role);
      }
      if (role.get('isComplianceOwner') || role.get('isComplianceUser')) {
        complianceRoles.push(role);
      }
    });
    return platformRoles.length > 0 && complianceRoles.length > 0 && this.get('billingDetail.allowPHI');
  })
});
