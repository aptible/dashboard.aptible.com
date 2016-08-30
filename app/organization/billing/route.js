import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('organization');
  },

  setupController(controller, model){
    model = model.get('organization');
    const billingDetail = model.get('billingDetail');
    const stacks = model.stacks;

    controller.setProperties({ model, billingDetail, stacks });
  }
});
