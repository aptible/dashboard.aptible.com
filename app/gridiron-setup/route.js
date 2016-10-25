import Ember from 'ember';

export default Ember.Route.extend({
  redirect() {
    let hasSPD = this.get('complianceStatus.authorizationContext.enabledFeatures.spd');

    if(!hasSPD) {
      this.transitionTo('gridiron-admin');
    }
  },

  model() {
    return this.get('complianceStatus.organizationProfile');
  },

  setupController(controller, model) {
    let complianceStatus = this.get('complianceStatus');

    controller.set('model', model);
    controller.set('roles', complianceStatus.get('roles'));
    controller.set('organization', complianceStatus.get('organization'));
  }
});
