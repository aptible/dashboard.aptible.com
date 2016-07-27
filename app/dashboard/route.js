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
    model.organizations.forEach((org) => {
      let billingDetailPromise = this.store.find('billing-detail', org.get('id'));
      org.set('billingDetail', billingDetailPromise);
      billingDetailPromise.then(function(billingDetail) {
        org.set('billingDetail', billingDetail);
        org.set('hasCompliancePlan', billingDetail.get('hasCompliancePlan'));
      });
    });
    return true;
  }
});
