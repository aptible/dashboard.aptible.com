import Ember from 'ember';

export default Ember.Route.extend({
  complianceStatus: Ember.inject.service(),
  model() {
    return this.get('complianceStatus.organizationProfile');
  },

  setupController(controller) {
    let organization = this.get('complianceStatus.organization');
    controller.set('organizations', this.modelFor('gridiron').get('organization'));
    controller.set('organization', organization);
  },

  redirect(model) {
    let isComplianceAdmin = this.get('authorization').checkAbility('manage', model);

    // Redirect to gridiron user for users without manage scope
    if(!isComplianceAdmin) {
      let message = `Access Denied: You must be a Gridiron Owner in order to view this page`;
      Ember.get(this, 'flashMessages').danger(message);

      this.transitionTo('gridiron-user');
    }

    // Redirect to SPD if feature is enabled and is incomplete
    // TODO: Instead of this, we should add an alert to gridiron admin
    // dashboard
    //
    // if(this.get('authorization.features.spd') && this.get('complianceStatus.requiresSPD')) {
    //   this.transitionTo('setup');
    // }
  }
});
