import Ember from 'ember';
import OrganizationProfile from 'sheriff/models/organization-profile';

export default Ember.Route.extend({
  model() {
    let organization = this.modelFor('organization');
    return OrganizationProfile.findOrCreate(organization, this.store);
  },

  setupController(controller, model) {
    let organization = this.modelFor('organization');

    controller.set('model', model);
    controller.set('roles', organization.get('roles'));
    controller.set('organization', organization);
  }
});
