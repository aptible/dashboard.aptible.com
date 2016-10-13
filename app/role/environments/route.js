import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('role');
  },

  redirect() {
    let role = this.modelFor('role');
    // If this is a compliance role, users shouldn't be here
    if(role.get('isComplianceRole')) {
      this.transitionTo('role.members');
    }
  },

  setupController(controller, model) {
    let contextHref = model.get('data.links.organization');
    let context = this.get('authorization').getContextByHref(contextHref);

    controller.set('model', model);
    controller.set('stacks', context.get('stacks'));
    controller.set('organization', context.get('organization'));
    controller.set('currentUserRoles', context.get('currentUserRoles'));
    controller.set('authorizationContext', context);
  }
});
