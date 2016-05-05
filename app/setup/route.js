import Ember from 'ember';
import OrganizationProfile from 'diesel/models/organization-profile';

export default Ember.Route.extend({
  model() {
    let organization = this.modelFor('compliance-organization');
    return OrganizationProfile.findOrCreate(organization, this.store);
  },

  setupController(controller, model) {
    let organization = this.modelFor('compliance-organization');

    controller.set('model', model);
    controller.set('roles', organization.get('roles'));
    controller.set('organization', organization);
  }
});
