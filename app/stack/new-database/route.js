import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    var stack = this.modelFor('stack');
    return this.store.createRecord('database', {
      stack: stack
    });
  },

  actions: {
    create: function(){
      var db = this.currentModel,
          route = this,
          controller = this.controller,
          store = this.store;

      db.save().then(function(){
        var op = store.createRecord('operation', {
          type: 'provision',
          diskSize: controller.get('diskSize'),
          database: db
        });

        return op.save();
      }).then(function(){
        route.transitionTo('databases.index');
      }, function(e){
        console.error(e);
        // TODO display errors in UI
      });
    },

    cancel: function(){
      var db = this.currentModel;

      db.rollback();
      this.transitionTo('databases.index');
    }
  }
});
