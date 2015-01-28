import Ember from "ember";

export default Ember.Route.extend({

  actions: {
    deprovision: function(){
      var app = this.currentModel;
      var route = this;
      var controller = this.controller;
      var store = this.store;
      controller.set('error', null);

      app.get('stack').then(function(stack) {
        var op = store.createRecord('operation', {
          type: 'deprovision',
          app: app
        });
        return op.save().then(function(){
          return app.reload();
        }).then(function(){
          route.transitionTo('stack', stack);
        }, function(e){
          controller.set('error', e);
        });
      });
    }
  }

});
