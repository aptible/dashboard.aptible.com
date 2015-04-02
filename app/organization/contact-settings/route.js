import Ember from 'ember';

export default Ember.Route.extend({
  afterModel(model) {
    return Ember.RSVP.all([
      model.get('users'),
      model.get('securityOfficer'),
      model.get('billingContact')
    ]);
  }
});