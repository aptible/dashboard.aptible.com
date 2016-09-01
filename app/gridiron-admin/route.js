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
    let organization = this.get('complianceStatus.organization');
    controller.set('organizations', this.modelFor('gridiron').get('organization'));
    controller.set('organization', organization);
  },

  redirect() {
    let context = this.get('complianceStatus.authorizationContext');

    if (!context.get('userIsGridironOrOrganizationAdmin')) {
      let message = `Access Denied: You must be a Gridiron Owner in order to view this page`;
      Ember.get(this, 'flashMessages').danger(message);

      this.transitionTo('gridiron-user');
    }
  }
});
