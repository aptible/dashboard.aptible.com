import Ember from 'ember';

export default Ember.Route.extend({
  complianceStatus: Ember.inject.service(),
  model(params) {
    let organizations = this.modelFor('gridiron');
    let organization = organizations.findBy('id', params.organization_id);
    let complianceStatus = this.get('complianceStatus');
    let authorization = this.get('authorization');

    return Ember.RSVP.hash({
      complianceStatus: complianceStatus.loadOrganizationStatus(organization),
      authorizationContext: authorization.load()
    });
  },

  afterModel(model) {
    // TODO: This could probably be done somewhere else.
    // Ideally the authorization context could build the complianceStatus
    // service itself
    this.set('complianceStatus.authorizationContext', model.authorizationContext);
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('organizations', this.modelFor('gridiron'));
  }
});
