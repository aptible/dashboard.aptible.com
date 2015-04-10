import Ember from 'ember';
import { resetDBData } from "../route";

export var firstAppKey = '_aptible_firstAppData';

export default Ember.Route.extend({
  actions: {
    selectDbType: function(dbType){
      let currentType = Ember.get(this.currentModel, 'dbType');
      if (currentType === dbType) {
        resetDBData(this.currentModel);
      } else {
        Ember.set(this.currentModel, 'dbType', dbType);
      }
    },

    setDiskSize: function(diskSize){
      Ember.set(this.currentModel, 'initialDiskSize', diskSize);
    }

  }
});
