import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let context = this.modelFor('organization');
    let organization = context.get('organization');

    return this.store.createRecord('role', { organization });
  },

  setupController(controller, model) {
    let context = this.modelFor('organization');
    let { organization, billingDetail } = context;
    controller.setProperties({ model, organization, billingDetail });
  },

  actions: {
    willTransition() {
      this.currentModel.rollback();
    },

    cancel() {
      this.transitionTo('organization.roles');
    },

    save() {
      let role = this.currentModel;

      role.save().then(() => {
        let message = `${role.get('name')} created`;

        this.transitionTo('role.members', role);
        Ember.get(this, 'flashMessages').success(message);
      });
    }
  }
});
