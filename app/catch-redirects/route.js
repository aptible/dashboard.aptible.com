import Ember from 'ember';

export default Ember.Route.extend({
  redirect() {
    return this.handleNoOrganizations() ||
           this.handleMissingBillingDetail() ||
           this.handleComplianceOnlyUsers() ||
           this.handleNoStacks() ||
           true;
  },

  handleNoOrganizations() {
    if(this.get('authorization.hasNoOrganizations')) {
      return this.transitionTo('no-organization');
    }
  },

  handleMissingBillingDetail() {
    // If they have more than one organization, we won't redirect
    // Instead, we will put an icon on any account missing payment
    // with a link to setup payment
    if (!this.get('authorization.organizationContexts.hasSingleOrganization')) {
      return;
    }

    // User's only organization is missing billing detail. get out of here
    let context = this.get('authorization.organizationContexts.firstObject');
    if (context.get('hasNoBillingDetail')) {
      let message = `You cannot view Enclave until you have provided a payment
                    method`;
      Ember.get(this, 'flashMessages').danger(message);
      return this.transitionTo('welcome.payment-info', context.get('organization.id'));
    }
  },

  handleComplianceOnlyUsers() {
    if (!this.features.get('gridiron-user')) {
      return;
    }

    // If no organization context has any enclave access, get out of here
    if (!this.get('authorization.hasAnyEnclaveAccess')) {
      let message = `You do not have access to view Enclave resources. If this
                     is a mistake, please contact either your account owner or
                     support@aptible.com`;
      Ember.get(this, 'flashMessages').danger(message);
      return this.transitionTo('gridiron-user');
    }
  },

  handleNoStacks() {
    if(this.get('authorization.hasNoStacks')) {
      return this.transitionTo('no-stack');
    }
  }
});
