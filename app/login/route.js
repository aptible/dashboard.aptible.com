import Ember from "ember";
import DisallowAuthenticated from "../mixins/routes/disallow-authenticated";

export function buildCredentials(email, password) {
  return {
    username: email,
    password,
    grant_type: 'password',
    scope: 'manage'
  };
}

export default Ember.Route.extend(DisallowAuthenticated, {

  model: function() {
    return Ember.Object.create({
      email: '',
      password: ''
    });
  },

  redirect: function(){
    if (this.session.get('isAuthenticated')) {
      this.transitionTo('index');
    }
  },

  actions: {

    login: function(authAttempt){
      var credentials = buildCredentials(authAttempt.email, authAttempt.password);

      this.controller.set('isLoggingIn', true);

      this.session.open('aptible', credentials).then(() => {
        if (this.session.attemptedTransition) {
          this.session.attemptedTransition.retry();
          this.session.attemptedTransition = null;
        } else {
          this.controller.set('isSuccessful', true);
          this.transitionTo('index');
        }
      }, (e) => {
        this.currentModel.set('error', e.message);
      }).finally( () => {
        this.controller.set('isLoggingIn', false);
      });
    }
  }
});
