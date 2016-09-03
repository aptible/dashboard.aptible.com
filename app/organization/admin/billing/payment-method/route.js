import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('organization');
  },

  setupController(controller, model){
    controller.set('model', model.get('billingDetail'));
    controller.set('organization', model.get('organization'));
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
