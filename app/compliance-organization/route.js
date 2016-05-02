import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.find('organization', params.organization_id);
  },

  afterModel(model) {
    return Ember.RSVP.hash({
      users: model.get('users'),
      securityOfficer: model.get('securityOfficer'),
      roles: model.get('roles'),
      invitations: model.get('invitations')
    });
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('organizations', this.modelFor('compliance'));
  }
});
