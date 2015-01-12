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

  actions: {

    login: function(authAttempt){
      var route = this;
      var credentials = buildCredentials(authAttempt.email, authAttempt.password);
      this.session.open('aptible', credentials).then(function(){
        route.transitionTo('apps');
      }, function(e){
        route.currentModel.set('error', e.message);
      });
    }

  }

});
