import Ember from 'ember';
import { read } from '../utils/storage';
export var firstAppKey = '_aptible_firstAppData';

export default Ember.Route.extend({
  model: function(){
    var firstApp = read(firstAppKey);

    if (firstApp) {
      return firstApp;
    } else {
      return {
        appHandle: '',
        dbHandle: '',
        diskSize: 10,
        dbType: null
      };
    }
  },

  beforeModel: function() {
    if(!this.session.get('isAuthenticated')) {
      this.transitionTo('login');
    }
  }
});
