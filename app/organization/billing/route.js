import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    const organization = this.modelFor('organization');
    const billingDetail = this.store.find('billing-detail', organization.get('id'));
    const stacks = this.store.findStacksFor(organization);

    return Ember.RSVP.hash({
      organization: organization,
      billingDetail: billingDetail,
      stacks: stacks
    });
  },

  setupController(controller, model){
    controller.set('model', model.organization);
    controller.set('billingDetail', model.billingDetail);
    controller.set('stacks', model.stacks);
  }

});
