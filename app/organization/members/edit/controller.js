import Ember from 'ember';

export default Ember.Controller.extend({
  isSecurityOfficer: Ember.computed('organization.data.links.securityOfficer', 'model.data.links.self', function() {
    return this.get('organization.data.links.securityOfficer') ===
           this.get('model.data.links.self');
  }),
  isBillingContact: Ember.computed('organization.billingDetail.data.links.billingContact', 'model.data.links.self', function() {
    return this.get('organization.billingDetail.data.links.billingContact') ===
           this.get('model.data.links.self');
  }),
  disableRemoveMessage: Ember.computed('isSecurityOfficer', 'isBillingContact', function() {
    if(this.get('isSecurityOfficer')) {
      return `${this.get('model.name')} is this organization's Security Officer.`;
    } else if(this.get('isBillingContact')) {
      return `${this.get('model.name')} is this organization's Billing Contact.`;
    }

    return false;
  })
});
