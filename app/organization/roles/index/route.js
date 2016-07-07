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
    this.transitionTo('organization.roles.platform');
  }
});
