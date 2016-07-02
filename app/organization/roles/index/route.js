import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    let organization = this.modelFor('organization');

    return Ember.RSVP.hash({
      roles: organization.get('roles'),
      stacks: this.store.findStacksFor(organization),
      billingDetail: organization.get('billingDetail')
    });
  },

  redirect() {
    //if (!this.model.billingDetail.get('allowPHI')) { }
    this.transitionTo('organization.roles.platform');
  }
});
