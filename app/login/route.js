import Ember from "ember";

export default Ember.Route.extend({

  model: function() {
    return Ember.Object.create({
      email: '',
      password: ''
    });
  },

  actions: {

    login: function(authAttempt){
      var route = this;
      var credentials = {
        email: authAttempt.email,
        password: authAttempt.password,
      };
      this.session.open('aptible', credentials).then(function(){
        route.transitionTo('apps');
      }, function(e){
        route.currentModel.set('error', 'Error authenticating: '+e.message);
      });
    }

  }

});
