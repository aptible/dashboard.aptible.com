import Ember from 'ember';

export default Ember.Controller.extend({
  platformOwnerRole: Ember.computed('organization.roles', 'currentUser.roles', function() {
    let currentUser = this.get('currentUser');
    if (currentUser.isAccountOwner(this.get('currentUser.roles'), this.get('organization'))) {
      return this.get('organization.roles').sortBy('name');
    }
    // TODO: platform / compliance owners need a unique set here
    else {
      return this.get('organization.userRoles').sortBy('name');
    }
  }),

  isSecurityOfficer: Ember.computed('organization.securityOfficer.id', 'model.id', function() {
    return this.get('organization.securityOfficer.id') === this.get('model.id');
  }),
  isBillingContact: Ember.computed('organization.billingDetail.billingContact.id', 'model.id', function() {
    return this.get('organization.billingDetail.billingContact.id') === this.get('model.id');
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
