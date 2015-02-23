import Ember from "ember";

export function buildCredentials(email, password) {
  return {
    username: email,
    password: password,
    grant_type: 'password',
    scope: 'manage'
  };
}

export default Ember.Route.extend({
  requireAuthentication: false,

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
      this.session.open('aptible', credentials).then(() => {
        if (this.session.attemptedTransition) {
          this.session.attemptedTransition.retry();
          this.session.attemptedTransition = null;
        } else {
          this.transitionTo('index');
        }
      }, (e) => {
        this.currentModel.set('error', e.message);
      });
    }

  }

});
