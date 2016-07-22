import Ember from "ember";

export default Ember.Controller.extend({
  roleTypeSubTitle: Ember.computed('model.type', function() {
    if (this.get('model.isPlatformOwner') || this.get('model.isPlatformUser')) {
      return 'Platform Roles';
    }
    if (this.get('model.isComplianceOwner') || this.get('model.isComplianceUser')) {
      return 'Compliance Roles';
    }
    return 'Roles';
  }),

  backToRolesRoute: Ember.computed('model.type', function() {
    if (this.get('model.isComplianceOwner') || this.get('model.isComplianceUser')) {
      return 'organization.roles.compliance';
    }
    return 'organization.roles.platform';
  })
});
