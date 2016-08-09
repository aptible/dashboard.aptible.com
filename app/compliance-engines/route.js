import Ember from 'ember';

export default Ember.Route.extend({
  complianceStatus: Ember.inject.service(),
  model() {
    return this.get('complianceStatus.organizationProfile');
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
