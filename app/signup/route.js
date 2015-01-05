import Ember from 'ember';
import config from "../config/environment";
import { buildCredentials } from "../login/route";
import { replaceLocation } from "../utils/location";

export default Ember.Route.extend({

  beforeModel: function(){
    if (this.session.get('isAuthenticated')) {
      this.replaceWith('index');
    }
  },

  model: function() {
    return this.store.createRecord('user');
  },

  actions: {

    signup: function(){
      var user = this.currentModel;
      var session = this.session;
      var email = user.get('email');
      var password = user.get('password');
      user.save().then(function(){
        var credentials = buildCredentials(email, password);
        // TODO: This option causes a user request to fetch data already present in the identity map
        return session.open('aptible', credentials);
      }).then(function(){
        replaceLocation([config.legacyDashboardHost, 'organizations/new'].join('/'));
      }, function(){});
    }

  }

});
