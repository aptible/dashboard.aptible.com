import Ember from 'ember';
import DisallowAuthenticated from "../../mixins/routes/disallow-authenticated";

export default Ember.Route.extend(DisallowAuthenticated, {
  model: function(){
    return this.store.createRecord('password-reset-request');
  },

  actions: {
    reset: function(model){
      model.save().then( () => {
        this.transitionTo('login');
      }, () => {
        this.controllerFor('password/reset').set('error', `
          There was an error resetting your password.
        `);
      });
    }
  }
});
