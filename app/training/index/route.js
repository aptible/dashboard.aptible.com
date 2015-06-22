import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      users: this.modelFor('organization').get('users'),
      criteria: this.modelFor('training'),
      permissions: this.store.find('permission')
    });
  },

  afterModel(model) {
    return Ember.RSVP.hash({
      roles: this.modelFor('organization').get('roles'),
      securityOfficer: this.modelFor('organization').get('securityOfficer'),
      documents: model.criteria.map((c) => c.get('documents'))
    });
  },

  setupController(controller, model) {
    controller.set('criteria', model.criteria);
    controller.set('model', model.users);
    controller.set('permissions', model.permissions);
    controller.set('organization', this.modelFor('organization'));
  }
});
