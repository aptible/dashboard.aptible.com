import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),

  logDrain: null,

  sendError(e, message) {
    message = Ember.get(e, 'responseJSON.message') || message;
    this.sendAction('failedAction', message);
  },

  actions: {
    restart(){
      let message = `Successfully restarted ${this.logDrain.get('handle')}`;
      let errorMessage = `There was an error restarting ${this.logDrain.get('handle')}.`;
      let logDrain = this.logDrain;
      let component = this;
      var op = this.get('store').createRecord('operation', {
        type: 'configure',
        logDrain: this.logDrain
      });
      op.save().then(function(){
        logDrain.set('status', 'provisioning');
        logDrain.save().then(function() {
          component.sendAction('completedAction', message);
        }).catch( (e) => { component.sendError(e, errorMessage); });
      }).catch( (e) => { component.sendError(e, errorMessage); });
    },

    deprovision(){
      let message = `Successfully deprovisioned ${this.logDrain.get('handle')}`;
      let errorMessage = `There was an error restarting ${this.logDrain.get('handle')}.`;
      let logDrain = this.logDrain;
      let component = this;
      var op = this.get('store').createRecord('operation', {
        type: 'deprovision',
        logDrain: logDrain
      });
      op.save().then(function(){
        logDrain.set('status', 'deprovisioning');
        logDrain.save().then(function() {
          component.sendAction('completedAction', message);
        }).catch( (e) => { component.sendError(e, errorMessage); });
      }).catch( (e) => { component.sendError(e, errorMessage); });
      Ember.run.later(component, function() {
        logDrain.deleteRecord();
      }, 5000);
    }
  }
});
