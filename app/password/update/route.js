import Ember from 'ember';
import DisallowAuthenticated from "diesel/mixins/routes/disallow-authenticated";

export default Ember.Route.extend(DisallowAuthenticated, {
  model: function(params){
    return {
      challengeId: params.challenge_id,
      verificationCode: params.verification_code,
      userId: params.user_id,
      password: null,
      passwordConfirmation: null
    };
  },

  actions: {
    save: function(model){
      var verification = this.store.createRecord('verification', {
        challengeId: model.challengeId,
        verificationCode: model.verificationCode,
        password: model.password,
        type: 'password_reset_challenge'
      });
      verification.save().then( () => {
        this.transitionTo('login');
      }, () => {
        verification.destroy();
        this.controllerFor('password/update').set('error', `
          There was an error resetting your password.
        `);
      });
    }
  }
});
