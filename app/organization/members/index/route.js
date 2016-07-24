import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    let organization = this.modelFor('organization');

    return Ember.RSVP.hash({
      organization: organization,
      users: organization.get('users'),
      currentUserRoles: this.session.get('currentUser.roles'),
      invitations: organization.get('invitations')
    });
  },

  setupController(controller, model){
    let isAccountOwner = this.session.get('currentUser')
                           .isAccountOwner(model.currentUserRoles, model.organization);
    controller.set('model', model.users);
    controller.set('currentUserRoles', model.currentUserRoles);
    controller.set('isAccountOwner', isAccountOwner);
    controller.set('organization', model.organization);
    controller.set('invitations', model.invitations);
  }
});
