import Ember from 'ember';

export default Ember.Route.extend({
  complianceStatus: Ember.inject.service(),
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
