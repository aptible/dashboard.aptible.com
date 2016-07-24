import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    let organization = this.modelFor('organization');

    return Ember.RSVP.hash({
      roles: organization.get('roles'),
      stacks: this.store.findStacksFor(organization),
      currentUserRoles: this.session.get('currentUser.roles'),
      billingDetail: organization.get('billingDetail'),
      organization: organization
    });
  },

  afterModel(model){
    return Ember.RSVP.hash({
      users: Ember.RSVP.all(model.roles.map(r => r.get('users')))
    });
  },

  setupController(controller, model){
    controller.set('model', model.roles);
    controller.set('stacks', model.stacks);
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
