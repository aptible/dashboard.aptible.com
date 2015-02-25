import Ember from 'ember';

export default Ember.Route.extend({
  title: function(){
    var stack = this.modelFor('stack');
    return `Create a Database - ${stack.get('handle')}`;
  },

  model: function(){
    var stack = this.modelFor('stack');
    return this.store.createRecord('database', {
      stack: stack
    });
  },

  renderTemplate: function(controller){
    if (!this.session.get('currentUser.verified')) {
      controller.set('resourceType', 'database');
      this.render('shared/unverified');
    } else {
      this._super.apply(this, arguments);
    }
  },

  actions: {
    willTransition: function(){
      this.currentModel.rollback();
    },

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
      this.transitionTo('databases.index');
    }
  }
});
