import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller, model){
    controller.set('stack', model);
  },

  actions: {
    cancel: function(){
      var stack = this.controller.get('stack');
      stack.rollback();
      this.transitionTo('apps');
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
