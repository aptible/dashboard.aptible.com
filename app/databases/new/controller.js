import Ember from 'ember';

export default Ember.Controller.extend({
  stack: Ember.inject.controller('stack'),
  showCancelButton: Ember.computed.gt('stack.persistedDatabases.length', 0),

  diskSize: 10,

  actions: {
    didSlide: function(val){
      this.set('diskSize', val);
    },

    selectDbType: function(type){
      this.set('model.type', type);
    }
  }
});
