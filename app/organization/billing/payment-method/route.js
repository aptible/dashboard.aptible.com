import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    const organization = this.modelFor('organization');
    return this.store.find('billing-detail', organization.get('id'));
  },

  setupController(controller, model){
    controller.set('model', model);
    controller.set('organization', this.modelFor('organization'));
  },

  actions: {
    showPaymentForm() {
      this.controller.set('showPaymentForm', true);
    },

    hidePaymentForm() {
      this.controller.set('showPaymentForm', false);
    },

    updatedPayment() {
      this.controller.set('showPaymentForm', false);
      Ember.get(this, 'flashMessages').success('Updated payment method.');
    }
  }
});
