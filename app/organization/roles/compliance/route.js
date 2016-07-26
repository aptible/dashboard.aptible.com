import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    let organization = this.modelFor('organization');

    return Ember.RSVP.hash({
      roles: organization.get('roles'),
      currentUserRoles: this.session.get('currentUser.roles'),
      billingDetail: organization.get('billingDetail'),
      organization: organization
    });
  },

  setupController(controller, model){
    controller.set('model', model.roles);
    controller.set('organization', model.organization);
    controller.set('billingDetail', model.billingDetail);
    controller.set('currentUserRoles', model.currentUserRoles);
    controller.set('isAccountOwner', this.session.get('currentUser')
                    .isAccountOwner(model.currentUserRoles, model.organization));
  },

  redirect(model) {
    if (!model.billingDetail.get('allowPHI')) {
      this.transitionTo('organization.roles.platform');
    }
  }
});
