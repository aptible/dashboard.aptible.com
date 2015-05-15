import Ember from 'ember';
import DisallowAuthenticated from "diesel/mixins/routes/disallow-authenticated";

export default Ember.Route.extend(DisallowAuthenticated, {
  model: function(params){
    return {
      resetCode: params.reset_code,
      userId: params.user_id,
      password: null,
      passwordConfirmation: null
    };
  },

  actions: {
    save: function(model){
      var verification = this.store.createRecord('verification', {
        userId: model.userId,
        resetCode: model.resetCode,
        password: model.password,
        type: 'password_reset'
      });
      verification.save().then( () => {
        this.transitionTo('login');
      }, () => {
        verification.destroy();
        this.controllerFor('password/new').set('error', `
          There was an error resetting your password.
        `);
      });
    }
  }
});
