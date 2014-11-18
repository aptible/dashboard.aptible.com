import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return this.store.createRecord('app', {account: {id:'1'}});
  },

  actions: {
    create: function(){
      var app = this.currentModel;
      var route = this;

      app.save().then(function(){
        route.transitionTo('apps');
      }).catch(function(e){
        console.error(e);
      });
    }
  }
});
