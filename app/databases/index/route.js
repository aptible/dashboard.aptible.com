import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller, model){
    var stack = this.modelFor('stack');
    controller.set('model', model);
    controller.set('stack', stack);
  }
});
