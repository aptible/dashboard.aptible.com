import Ember from 'ember';

export default Ember.Route.extend({
  complianceStatus: Ember.inject.service(),
  model(params) {
    let organizations = this.modelFor('compliance');
    let organization = organizations.findBy('id', params.organization_id);
    let complianceStatus = this.get('complianceStatus');

    return complianceStatus.loadOrganizationStatus(organization);
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('organizations', this.modelFor('compliance'));
  }
});
