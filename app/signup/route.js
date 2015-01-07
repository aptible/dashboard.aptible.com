import Ember from 'ember';
import { buildCredentials } from "../login/route";

export default Ember.Route.extend({
  requireAuthentication: false,

  beforeModel: function(){
    var route = this, session = this.session;

    return this._super().then(function(){
      if (session.get('isAuthenticated')) {
        route.replaceWith('index');
      }
    });
  },

  setupController: function(controller){
    var user = this.store.createRecord('user');
    var organization = this.store.createRecord('organization');
    controller.set('model', user);
    controller.set('organization', organization);
  },

  actions: {

    signup: function(user, organization){
      var route = this;
      var session = this.session;
      var email = user.get('email');
      var password = user.get('password');
      user.save().then(function(){
        var credentials = buildCredentials(email, password);
        // TODO: This option causes a user request to fetch data already present in the identity map
        return session.open('aptible', credentials);
      }).then(function(){
        return organization.save();
      }).then(function(){
        route.transitionTo('welcome.first-app');
      }, function(){});
    }

  }

});
