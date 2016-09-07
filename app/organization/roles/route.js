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
      let role = this.store.createRecord('role', { organization });

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
