import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let role = this.modelFor('role');

    return Ember.RSVP.hash({
      role: role,
      memberships: role.get('memberships'),
      organization: role.get('organization'),
      stacks: this.store.findStacksFor(role.get('organization')),
      currentUserRoles: this.session.get('currentUser').get('roles')
    });
  },

  setupController(controller, model) {
    controller.set('model', model.role);
    controller.set('stacks', model.stacks);
    controller.set('organization', model.organization);
    controller.set('platformRole', model.role.get('platform'));
    controller.set('currentUserRoles', model.currentUserRoles);
  }
});
