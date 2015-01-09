import Ember from 'ember';
import { read, write } from '../../utils/storage';
import { replaceLocation } from "../../utils/location";
import config from "../../config/environment";

export var firstAppKey = '_aptible_firstAppData';

var subscriptionUrl = [config.legacyDashboardHost, 'subscriptions/new'].join('/');

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
    controller.set('subscriptionUrl', subscriptionUrl);
  },

  actions: {

    create: function(model){
      write(firstAppKey, model);
      replaceLocation( subscriptionUrl );
    },

    selectDbType: function(dbType){
      Ember.set(this.currentModel, 'dbType', dbType);
    },

    setDiskSize: function(diskSize){
      Ember.set(this.currentModel, 'diskSize', diskSize);
    }

  }
});
