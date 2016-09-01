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

  roleTypeParam: Ember.computed('model.type', function() {
    let type = this.get("model.type");
    if(type.match(/platform/)) {
      return 'platform';
    }

    return 'compliance';
  })
});
