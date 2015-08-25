import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let organization = this.modelFor('organization');
    return this.store.findStacksFor(organization);
  },

  setupController(controller, model) {
    let organization = this.modelFor('organization');
    let billingDetail = this.modelFor('organization.billing').billingDetail;

    controller.set('model', model);
    controller.set('organization', organization);
    controller.set('billingDetail', billingDetail);
  }
});
