import Ember from 'ember';
import { read, write } from '../../utils/storage';
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

  setupController: function(controller, model) {
    controller.set('model', model);
  },

  actions: {

    create: function(model){
      write(firstAppKey, model);
      this.transitionTo('welcome.payment-info');
    },

    selectDbType: function(dbType){
      Ember.set(this.currentModel, 'dbType', dbType);
    },

    setDiskSize: function(diskSize){
      Ember.set(this.currentModel, 'diskSize', diskSize);
    }

  }
});
