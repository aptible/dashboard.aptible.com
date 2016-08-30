import Ember from 'ember';

export default Ember.Route.extend({
  model(params){
    return params.type;
  },

  setupController(controller, model){
    let context = this.modelFor('organization');
    let type = model;
    let userRoleTypeComputed = `organization${type.capitalize()}UserRoles`;
    let adminRoleTypeComputed = `organization${type.capitalize()}AdminRoles`;
    let userRoles = context.get(userRoleTypeComputed);
    let adminRoles = context.get(adminRoleTypeComputed);
    let ownerRoles = context.get('organizationOwnerRoles');

    controller.setProperties({ type, context, adminRoles, userRoles, ownerRoles });
  },

  redirect(model) {
    return;
    let context = this.modelFor('organization');

    // If current type is platform but org doesn't have Enclave plan, change
    // types to compliance
    if(model === 'platform' && !context.get('organizationHasEnclaveProduct')) {
      return this.transitionTo('organization.roles.type', 'compliance');
    }

    // If current type is compliance but org doesn't have Gridiron plan, change
    // types to platform
    if(model === 'compliance' && !context.get('organizationHasGridironProduct')) {
      return this.transitionTo('organization.roles.type', 'platform');
    }
  }
});
