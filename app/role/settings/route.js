import Ember from 'ember';

export default Ember.Route.extend({
  redirect() {
    let role = this.modelFor('role');
    let contextHref = role.get('data.links.organization');
    let authorizationContext = this.get('authorization').getContextByHref(contextHref);
    let canManageRole = authorizationContext.hasRoleScope('manage', role);

    if (!canManageRole) {
      this.transitionTo('role.members');
    }
  },

  actions: {
    save() {
      let role = this.currentModel;
      if (role.get('isDirty')) {
        role.save().then(() => {
          let message = `${role.get('name')} saved`;

          Ember.get(this, 'flashMessages').success(message);
          this.transitionTo('role.members');
        });
      }
    }
  }
});
