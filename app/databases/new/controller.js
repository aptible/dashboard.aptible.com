import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['stack'],
  persistedDatabases: Ember.computed.alias('controllers.stack.persistedDatabases'),
  showCancelButton: Ember.computed.gt('persistedDatabases.length', 0),

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
