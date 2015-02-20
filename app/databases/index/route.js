import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller, model){
    var stack = this.modelFor('stack');
    controller.set('model', model);
    controller.set('stack', stack);
  },
  redirect: function(model) {
    if(model.get('length') === 0) {
      this.transitionTo('databases.new', this.modelFor('stack'));
    }
  }
});
