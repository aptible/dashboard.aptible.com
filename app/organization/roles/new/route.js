import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let organization = this.modelFor('organization');
    
    // Note: organization.get('billingDetail') works, but this is easier to test.
    let billingDetail = this.store.find('billing-detail', organization.get('id'));

    return Ember.RSVP.hash({
      role: this.store.createRecord('role', {
        organization
      }),
      organization,
      billingDetail: billingDetail
    });
  },

  setupController(controller, model) {
    controller.set('model', model.role);
    controller.set('organization', model.organization);
    controller.set('billingDetail', model.billingDetail);
  },

  actions: {
    willTransition() {
      this.currentModel.role.rollback();
    },

    cancel() {
      this.transitionTo('organization.roles');
    },

    save() {
      let role = this.currentModel.role;

      role.save().then(() => {
        let message = `${role.get('name')} created`;

        this.transitionTo('role.environments', role);
        Ember.get(this, 'flashMessages').success(message);
      });
    }
  }
});
