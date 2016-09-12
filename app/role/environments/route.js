import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('role');
  },

  setupController(controller, model) {
    let contextHref = model.get('data.links.organization');
    let context = this.get('authorization').getContextByHref(contextHref);
    let canManageRole = context.hasRoleScope('manage', model);

    controller.set('model', model);
    controller.set('stacks', context.get('stacks'));
    controller.set('organization', context.get('organization'));
    controller.set('currentUserRoles', context.get('currentUserRoles'));
    controller.set('canManagePermissions', canManageRole);
    controller.set('authorizationContext', context);
  }
});
