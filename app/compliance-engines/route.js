import Ember from 'ember';
import OrganizationProfile from 'diesel/models/organization-profile';

export default Ember.Route.extend({
  model() {
    let organization = this.modelFor('compliance-organization');
    return OrganizationProfile.findOrCreate(organization, this.store);
  },

  afterModel(model) {
    if (!model.get('hasCompletedSetup')) {
      this.transitionTo('setup');
    }
  },

  setupController(controller) {
    controller.set('organizations', this.modelFor('compliance'));
    controller.set('organization', this.modelFor('compliance-organization'));
  },

  renderTemplate() {
    this._super.apply(this, arguments);
    this.render('sidebars/engine-sidebar', { into: 'compliance-engines', outlet: 'sidebar' });
  }
});
