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
      let component = this;
      var op = this.get('store').createRecord('operation', {
        type: 'configure',
        logDrain: this.logDrain
      });
      op.save().then(() => {
        component.logDrain.set('status', 'provisioning');
        component.logDrain.save().then(() => {
          component.sendAction('completedAction', message);
        }).catch( (e) => { component.sendError(e, errorMessage); });
      }).catch( (e) => { component.sendError(e, errorMessage); });
    },

    deprovision(){
      // Confirm...
      let confirmMsg = `\nDeprovisioning will remove ${this.logDrain.get('handle')} and CANNOT be undone.\n\n`;
      confirmMsg += 'Are you sure you want to continue?\n';
      if (!confirm(confirmMsg)) { return false; }

      let message = `Successfully deprovisioned ${this.logDrain.get('handle')}`;
      let errorMessage = `There was an error restarting ${this.logDrain.get('handle')}.`;
      let component = this;
      let logDrain = this.logDrain; // Keep a ref for the run later
      var op = this.get('store').createRecord('operation', {
        type: 'deprovision',
        logDrain: logDrain
      });
      op.save().then(() => {
        logDrain.set('status', 'deprovisioning');
        logDrain.save().then(() => {
          component.sendAction('completedAction', message);
        }).catch( (e) => { component.sendError(e, errorMessage); });
      }).catch( (e) => { component.sendError(e, errorMessage); });
      Ember.run.later(component, () => {
        logDrain.deleteRecord();
      }, 5000);
    }
  }
});
