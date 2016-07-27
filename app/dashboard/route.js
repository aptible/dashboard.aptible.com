import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      stacks: this.store.find('stack'),
      organizations: this.store.find('organization'),
      currentUserRoles: this.session.get('currentUser.roles')
    });
  },

  afterModel(model) {
    return Ember.RSVP.all(model.organizations.map(o => o.get('billingDetail')));
  }
});
