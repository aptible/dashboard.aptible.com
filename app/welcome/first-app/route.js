import Ember from 'ember';
export var firstAppKey = '_aptible_firstAppData';

export default Ember.Route.extend({
  actions: {

    create: function(){
      // model data is already stored on the parent
      // route (welcome). Just move forward.
      this.transitionTo('welcome.payment-info');
    },

    selectDbType: function(dbType){
      Ember.set(this.currentModel, 'dbType', dbType);
    },

    setDiskSize: function(diskSize){
      Ember.set(this.currentModel, 'initialDiskSize', diskSize);
    }

  }
});
