import Ember from 'ember';

export default Ember.Route.extend({
  requireAuthentication: false,
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
