import Ember from 'ember';
import DisallowAuthenticated from "diesel/mixins/routes/disallow-authenticated";

export default Ember.Route.extend(DisallowAuthenticated, {
  model() {
    return this.store.createRecord('password-reset-request');
  },

  resetController(controller) {
    controller.setProperties({
      error: null,
      hasSubmitted: false
    });
  },

  actions: {
    reset(model) {
      model.save().then( () => {
        this.transitionTo('login');
      }, () => {
        this.controller.set(
          'error', `There was an error resetting your password. `);
      });
    },
    willTransition() {
      this.controllerFor('password/reset').set('error', null);
    }
  }
});
