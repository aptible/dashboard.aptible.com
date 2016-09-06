import Ember from 'ember';

export default Ember.Route.extend({
  title() {
    let stack = this.modelFor('stack');
    return `${stack.get('handle')} Log Drains`;
  },

  model() {
    let stack = this.modelFor('stack');

    return Ember.RSVP.hash({
      logDrains: stack.get('logDrains'),
      databases: stack.get('databases')
    });
  },

  setupController(controller, model) {
    let stack = this.modelFor('stack');
    let esDatabases = model.databases.filterBy('type', 'elasticsearch').filter((d) => d.get('connectionUrl'));
    controller.setProperties({ stack, model: model.logDrains, esDatabases });
  },

  actions: {
    openCreateLogDrainModal() {
      let stack = this.modelFor('stack');
      let logDrain = this.store.createRecord('log-drain', { stack });
      this.controller.set('newLogDrain', logDrain);
    },

    onCreateLogDrain(logDrain) {
      logDrain.save().then(() => {
        let operation = this.store.createRecord('operation', { type: 'configure', logDrain });
        return operation.save();
      }).then(() => {
        Ember.get(this, 'flashMessages').success('Log drain created');
      }, (e) => {
        let defaultMessage = 'There was an error creating new log drain.';
        let message = Ember.getWithDefault(e, 'responseJSON.message', defaultMessage);
        Ember.get(this, 'flashMessages').danger(message);
      });
    }
  }
});
