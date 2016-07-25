import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      role: this.modelFor('role'),
      currentUserRoles: this.session.get('currentUser.roles')
    });
  },

  setupController(controller, model) {
    controller.set('model', model.role);
    controller.set('stacks', this.store.findStacksFor(model.role.get('organization')));
    controller.set('organization', model.role.get('organization'));
    controller.set('platformRole', model.role.get('platform'));
    controller.set('currentUserRoles', model.currentUserRoles);
  }
});
