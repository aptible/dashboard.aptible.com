import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let organization = this.modelFor('organization');
    return this.store.createRecord('role', {
      organization
    });
  },

  afterModel() {
    let organization = this.modelFor('organization');
    return Ember.RSVP.resolve(organization.get('billingDetail'));
  },

  setupController(controller, model) {
    let organization = this.modelFor('organization');
    controller.set('model', model);
    controller.set('organization', organization);
    controller.set('billingDetail', organization.get('billingDetail'));
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

        this.transitionTo('role.environments', role);
        Ember.get(this, 'flashMessages').success(message);
      });
    }
  }
});
