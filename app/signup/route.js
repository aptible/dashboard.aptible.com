import Ember from 'ember';
import { buildCredentials } from "../login/route";

export default Ember.Route.extend({

  model: function() {
    return this.store.createRecord('user');
  },

  actions: {

    signup: function(){
      var user = this.currentModel;
      var route = this;
      var session = this.session;
      var email = user.get('email');
      var password = user.get('password');
      user.save().then(function(){
        var credentials = buildCredentials(email, password);
        // TODO: This option causes a user request to fetch data already present in the identity map
        return session.open('aptible', credentials);
      }).then(function(){
        route.transitionTo('index');
      });
    }

  }

});
