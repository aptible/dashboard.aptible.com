import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    let authorizationContext = this.get('authorization').getContext(params.organization_id);
    let complianceStatus = this.get('complianceStatus');

    return complianceStatus.loadOrganizationStatus(authorizationContext);
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('organizations', this.modelFor('gridiron'));
  }
});
