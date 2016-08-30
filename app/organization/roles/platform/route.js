import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    let context = this.modelFor('organization');
    return context.get('roles');
  },

  setupController(controller, model){
    let context = this.modelFor('organization');
    let {
      stacks,
      organization,
      billingDetail,
      currentUserRoles } = context.getProperties('stacks', 'organization', 'billingDetail', 'currentUserRoles');

    controller.setProperties({ model, stacks, organization, billingDetail, currentUserRoles });
    controller.set('isAccountOwner', context.get('isOrganizationAdmin'));
  },

  redirect(model) {
    let context = this.modelFor('organization');

    if(!context.get('hasEnclaveAccess')) {
      this.transitionTo('organization.roles.compliance');
    }
  }
});
