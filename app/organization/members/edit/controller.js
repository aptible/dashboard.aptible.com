import Ember from 'ember';

export default Ember.Controller.extend({
  isSecurityOfficer: Ember.computed('context.securityOfficer.id', 'model.id', function() {
    return this.get('context.securityOfficer.id') === this.get('model.id');
  }),

  isBillingContact: Ember.computed('context.billingContact.id', 'model.id', function() {
    return this.get('context.billingContact.id') === this.get('model.id');
  }),

  removeMessage(userName, orgName, officer) {
    return `${userName} is ${orgName}'s ${officer} and cannot be removed until
            another user is assigned.`;
  },

  disableRemoveMessage: Ember.computed('isSecurityOfficer', 'isBillingContact', function() {
    let userName = this.get('model.name');
    let orgName = this.get('organization.name');
    if (this.get('isSecurityOfficer')) {
      return this.removeMessage(userName, orgName, 'Security Officer');
    }
    if (this.get('isBillingContact')) {
      return this.removeMessage(userName, orgName, 'Billing Contact');
    }
    return false;
  })
});
