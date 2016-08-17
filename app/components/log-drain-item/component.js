import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    completedAction(message) {
      this.sendAction('completedAction', message);
    },
    failedAction(message) {
      this.sendAction('failedAction', message);
    }
  }
});
