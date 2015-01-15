import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    var stack = this.modelFor('stack');
    return this.store.createRecord('app', {
      stack: stack
    });
  },

  actions: {
    willTransition: function(){
      this.currentModel.rollback();
    },

    create: function(){
      var app = this.currentModel;
      var route = this;
      app.save({ stack: {id: app.get('stack.id')} }).then(function(){
        route.transitionTo('apps.index');
      });
    },

    cancel: function(){
      this.transitionTo('apps.index');
    }
  }
});
