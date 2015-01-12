import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller, model){
    controller.set('stack', model);
  },

  discardChanges: function(){
    var stack = this.controller.get('stack');
    stack.rollback();
  },

  actions: {
    cancel: function(){
      this.discardChanges();
      this.transitionTo('apps');
    },

    willTransition: function(){
      this.discardChanges();
    },

    update: function(){
      var stack = this.controller.get('stack');
      var route = this;

      stack.save().then(function(){
        route.transitionTo('apps');
      }).catch(function(e){
        // TODO handle errors saving a stack
        console.error('Error saving stack:',e);
      });
    }
  }
});
