import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    completedAction(message) {
      Ember.get(this, 'flashMessages').success(message);
    },
    failedAction(message) {
      Ember.get(this, 'flashMessages').danger(message);
    }
  }
});
