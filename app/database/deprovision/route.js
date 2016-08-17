import Ember from 'ember';

export default Ember.Route.extend({
  titleToken: function(){
    var database = this.modelFor('database');
    return `Deprovision ${database.get('handle')}`;
  },

  actions: {
    deprovision: function(){
      let database = this.currentModel;
      let route = this;
      let controller = this.controller;
      let store = this.store;
      let message = `${database.get('handle')} is now deprovisioning`;
      controller.set('error', null);

      database.get('stack').then(function(stack) {
        var op = store.createRecord('operation', {
          type: 'deprovision',
          database: database
        });
        op
          .save()
          .then(function() {
            database.set('status', 'deprovisioning');
            // This is kind of crappy, but the reloading doesn't work properly unless the model is saved.
            database.save();
          })
          .then(function() {
          route.transitionTo('databases', stack);
          Ember.get(route, 'flashMessages').success(message);
        }, function(e){
          controller.set('error', e);
        });
      });
    }
  }

});
