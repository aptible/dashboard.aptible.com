import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    let organization = this.modelFor('organization');

    return Ember.RSVP.hash({
      roles: organization.get('roles'),
      organization: organization,
      currentUserRoles: this.session.get('currentUser.roles'),
      billingDetail: organization.get('billingDetail')
    });
  },

  setupController(controller, model){
    controller.set('model', model.roles);
    controller.set('stacks', this.store.findStacksFor(model.organization));
    controller.set('organization', model.organization);
    controller.set('billingDetail', model.billingDetail);
    controller.set('currentUserRoles', model.currentUserRoles);
    controller.set('isAccountOwner', this.session.get('currentUser')
                    .isAccountOwner(model.currentUserRoles, model.organization));
  },

  redirect(model) {
    let currentUser = this.session.get('currentUser');

    if (currentUser.complianceRolesOnly(model.currentUserRoles, model.organization)) {
      this.transitionTo('organization.roles.compliance');
    }
  }
});
