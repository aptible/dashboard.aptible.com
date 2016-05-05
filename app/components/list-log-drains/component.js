import Ember from 'ember';

export default Ember.Component.extend({
  //sortBy: ['handle:asc'],

  arrayChanged: function() {
    Ember.run.once(this, 'checkModelArray');
  }.observes('model.[]'),

  checkModelArray: function() {
    if(this.get('model').get('length') === 0) {
      this.sendAction('redirect');
    }
  },

  provisionedLogDrains: Ember.computed.filterBy('model', 'isProvisioned'),
  pendingLogDrains: Ember.computed.filterBy('model', 'isPending'),
  provisioningLogDrains: Ember.computed.filterBy('model', 'isProvisioning'),
  failedProvisioningLogDrains: Ember.computed.filterBy('model', 'hasFailedProvision'),
  failedDeprovisioningLogDrains: Ember.computed.filterBy('model', 'hasFailedDeprovision'),
  pendingOrProvisioningLogDrains: Ember.computed.union('provisioningLogDrains', 'pendingLogDrains'),
  deprovisionedLogDrains: Ember.computed.filterBy('model', 'hasBeenDeprovisioned'),
  hasActive: Ember.computed.gt('provisionedLogDrains.length', 0),
  hasPending: Ember.computed.gt('pendingOrProvisioningLogDrains.length', 0),
  hasDeprovisioning: Ember.computed.gt('deprovisionedLogDrains.length', 0),
  hasFailedProvision: Ember.computed.gt('failedProvisioningLogDrains.length', 0),
  hasFailedDeprovision: Ember.computed.gt('failedDeprovisioningLogDrains.length', 0),
  showSortableHeader: Ember.computed.or('hasPending', 'hasDeprovisioning'),

  actions: {
    redirect() {
      this.sendAction('forceRedirect');
    },
    completedAction(message) {
      this.sendAction('completedAction', message);
    },
    failedAction(message) {
      this.sendAction('failedAction', message);
    }
  }
});
