import Ember from "ember";

export default Ember.Route.extend({
  titleToken: function(){
    var app = this.modelFor('app');
    return `Deprovision ${app.get('handle')}`;
  },

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
        return op.save()
          .then(() => app.set('status', 'deprovisioning'))
          .then(() => route.transitionTo('apps', stack), (e) => controller.set('error', e));
      });
    }
  }

});
