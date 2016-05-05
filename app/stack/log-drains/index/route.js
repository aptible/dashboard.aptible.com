import Ember from 'ember';

export default Ember.Route.extend({
  redirect: function(model) {
    if(model.get('length') === 0) {
      this.transitionTo('stack.log-drains.new', this.modelFor('stack'));
    }
  },
  actions: {
    completedAction(message) {
      Ember.get(this, 'flashMessages').success(message);
    },
    failedAction(message) {
      Ember.get(this, 'flashMessages').danger(message);
    },
    forceRedirect: function() {
      this.transitionTo('stack.log-drains.new', this.modelFor('stack'));
    },
  }
});
