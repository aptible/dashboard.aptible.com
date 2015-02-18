import Ember from "ember";

export default Ember.Route.extend({

  actions: {
    deprovision: function(){
      var database = this.currentModel;
      var route = this;
      var controller = this.controller;
      var store = this.store;
      controller.set('error', null);

      database.get('stack').then(function(stack) {
        var op = store.createRecord('operation', {
          type: 'deprovision',
          database: database
        });
        return op.save().then(function(){
          return database.reload();
        }).then(function(){
          route.transitionTo('databases', stack);
        }, function(e){
          controller.set('error', e);
        });
      });
    }
  }

});
