import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('organization');
  },

  redirect(model) {
    let context = this.modelFor('organization');

    if (context.get('hasEnclaveAccess')) {
      this.transitionTo('organization.roles.platform');
    } else {
      this.transitionTo('organization.roles.compliance');
    }
  }
});
