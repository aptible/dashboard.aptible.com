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

  setupController: function(controller){
    var user = this.store.createRecord('user');
    var organization = this.store.createRecord('organization');
    controller.set('model', user);
    controller.set('organization', organization);
  },

  actions: {

    signup: function(user, organization){
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
        replaceLocation([config.legacyDashboardHost, 'organizations/new'].join('/'));
      }, function(){});
    }

  }

});
