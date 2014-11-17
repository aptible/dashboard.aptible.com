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
        username: authAttempt.email,
        password: authAttempt.password,
        grant_type: 'password'
      };
      this.session.open('aptible', credentials).then(function(){
        route.transitionTo('apps');
      }, function(e){
        route.currentModel.set('error', e.message);
      });
    }

  }

});
