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

  afterModel(model){
    return Ember.RSVP.hash({
      users: Ember.RSVP.all(model.roles.map(r => r.get('users')))
    });
  },

  setupController(controller, model){
    controller.set('model', model.roles);
    controller.set('stacks', model.stacks);
    controller.set('organization', this.modelFor('organization'));
    controller.set('billingDetail', model.billingDetail);
  }
});
