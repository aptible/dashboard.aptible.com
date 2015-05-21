import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let organization = this.modelFor('organization');
    return this.store.createRecord('stack', {
      organization,
      organizationUrl: organization.get('_data.links.self')
    });
  },

  setupController(controller, model) {
    let organization = this.modelFor('organization');
    controller.set('organization', organization);
    controller.set('model', model);
    controller.set('allowPHI', false);
  },

  actions: {
    willTransition() {
      this.currentModel.rollback();
    },

    cancel() {
      this.transitionTo('organization.environments');
    },

    save() {
      let stack = this.currentModel;
      let allowPHI = this.controller.get('allowPHI');

      if (allowPHI) {
        stack.set('type', 'production');
      } else {
        stack.set('type', 'development');
      }

      stack.save().then(() => {
        let message = `${stack.get('handle')} created`;

        this.transitionTo('organization.environments');
        Ember.get(this, 'flashMessages').success(message);
      });
    }
  }
});
