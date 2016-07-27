import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    const organization = this.modelFor('organization');
    // See dashboard/route.js -- billingDetail is set on organizations,
    // allowinig this to work (billingDetail is from a different api).
    const billingDetail = organization.get('billingDetail');
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
