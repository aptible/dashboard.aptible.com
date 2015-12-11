import Ember from 'ember';
import OrganizationProfile from 'sheriff/models/organization-profile';

export default Ember.Route.extend({
  model() {
    let organization = this.modelFor('organization');
    return OrganizationProfile.findOrCreate(organization, this.store);
  },

  afterModel() {
    let profile = this.modelFor('setup');
    let currentStep = profile.get('currentStep');

    return this.transitionTo(`setup.${currentStep}`);
  }
});
