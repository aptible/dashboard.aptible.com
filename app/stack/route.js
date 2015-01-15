import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller, model){
    var stacks = this.modelFor('stacks');
    controller.set('model', model);
    controller.set('stacks', stacks);
  }
});
