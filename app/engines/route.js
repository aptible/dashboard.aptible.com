import Ember from 'ember';
import OrganizationProfile from 'sheriff/models/organization-profile';

export default Ember.Route.extend({
  model() {
    let organization = this.modelFor('organization');
    return OrganizationProfile.findOrCreate(organization, this.store);
  },

  afterModel(model) {
    if (!model.get('hasCompletedSetup')) {
      this.transitionTo('setup');
    }
  },

  setupController(controller) {
    controller.set('organizations', this.modelFor('index'));
    controller.set('organization', this.modelFor('organization'));
  },

  renderTemplate() {
    this._super.apply(this, arguments);
    this.render('sidebars/engine-sidebar', { into: 'engines', outlet: 'sidebar' });
  }
});
