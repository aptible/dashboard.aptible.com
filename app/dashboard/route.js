import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      stacks: this.store.find('stack'),
      organizations: this.session.get('currentUser.organizations'),
      currentUserRoles: this.session.get('currentUser.roles')
    });
  },

  afterModel(model) {
    return Ember.RSVP.all(model.organizations.map(o => o.get('billingDetail')));
  }
});
