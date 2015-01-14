import Ember from 'ember';

export default Ember.Controller.extend({
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
