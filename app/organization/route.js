import Ember from 'ember';

export default Ember.Route.extend({
  afterModel(model) {
    return Ember.RSVP.hash({
      users: model.get('users'),
      securityOfficer: model.get('securityOfficer'),
      roles: model.get('roles')
    });
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('organizations', this.store.find('organization'));
  }
});
