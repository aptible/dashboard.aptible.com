import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    const organization = this.modelFor('organization');
    const billingDetail = this.store.find('billing-detail', organization.get('id'));
    return Ember.RSVP.hash({
      organization: organization,
      billingDetail: billingDetail
    });
  },

  setupController(controller, model){
    controller.set('model', model.organization);
    controller.set('billingDetail', model.billingDetail);
  }

});
