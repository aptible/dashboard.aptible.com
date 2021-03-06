import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('organization');
  },

  redirect(model) {
    if (model.get('userHasEnclaveAccess')) {
      this.transitionTo('organization.roles.type', 'platform');
    } else {
      this.transitionTo('organization.roles.type', 'compliance');
    }
  }
});
