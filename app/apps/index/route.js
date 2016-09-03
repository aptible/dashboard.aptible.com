import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller, model) {
    var stack = this.modelFor('stack');
    controller.set('model', model);
    controller.set('stack', stack);
  },
  redirect(model) {
    if(model.get('length') === 0) {
      this.transitionTo('apps.new', this.modelFor('stack'));
    }
  }
});


