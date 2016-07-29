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
    // If at least one of the billing details failed to load:
    // This happens when an organization has not completed payment setup
    // If we don't catch this failed promise, it will bubble up and cause
    // dashboard to redirect to a 404 error page.

    // We can't redirect here because that would cause an infinite redirect
    // loop.  noop here but expect that the `catch-redirects` route will
    // catch this error condition and redirect to collect payment info.
    let billingDetailPromises = model.organizations.map(o => o.get('billingDetail'));
    return Ember.RSVP.all(billingDetailPromises).catch(Ember.$.noop);
  }
});
