import Ember from 'ember';
import { replaceLocation } from "../utils/location";

export default Ember.Route.extend({
  beforeModel: function(){
    if (!this.session.get('isAuthenticated')) {
      this.transitionTo('login');
    }
  },
  activate: function(){
    this.session.close('aptible').then(function(){
      replaceLocation('/');
    });
  }
});
