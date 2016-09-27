import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('organization');
  },

  setupController(controller, authorizationContext){
    controller.setProperties({ authorizationContext });
  },

  actions: {
    openCreateRoleModal() {
      let authorizationContext = this.modelFor('organization');
      let { organization } = authorizationContext;
      let type = 'platform_user';

      if (authorizationContext.get('userIsGridironAdmin') && authorizationContext.get('organizationHasGridironProduct')) {
        type = 'compliance_user';
      }

      let role = this.store.createRecord('role', { organization, type });

      this.controller.set('newRole', role);
    },

    onCreateRole() {
      let role = this.controller.get('newRole');

      role.save().then(() => {
        this.transitionTo('role', role);
        let message = `${role.get('name')} created`;
        Ember.get(this, 'flashMessages').success(message);
      });
    }
  }
});
