import Ember from 'ember';

export default Ember.Controller.extend({
  sortBy: ['handle:asc'],
  persistedLogDrains: Ember.computed.filterBy('model', 'isNew', false),
  hasNoLogDrains: Ember.computed.equal('persistedLogDrains.length', 0),
  provisionedLogDrains: Ember.computed.filterBy('persistedLogDrains', 'isProvisioned'),
  pendingLogDrains: Ember.computed.filterBy('persistedLogDrains', 'isPending'),
  provisioningLogDrains: Ember.computed.filterBy('persistedLogDrains', 'isProvisioning'),
  failedProvisioningLogDrains: Ember.computed.filterBy('persistedLogDrains', 'hasFailedProvision'),
  failedDeprovisioningLogDrains: Ember.computed.filterBy('persistedLogDrains', 'hasFailedDeprovision'),
  pendingOrProvisioningLogDrains: Ember.computed.union('provisioningLogDrains', 'pendingLogDrains'),
  deprovisionedLogDrains: Ember.computed.filterBy('persistedLogDrains', 'hasBeenDeprovisioned'),
  hasActive: Ember.computed.gt('provisionedLogDrains.length', 0),
  hasPending: Ember.computed.gt('pendingOrProvisioningLogDrains.length', 0),
  hasDeprovisioning: Ember.computed.gt('deprovisionedLogDrains.length', 0),
  hasFailedProvision: Ember.computed.gt('failedProvisioningLogDrains.length', 0),
  hasFailedDeprovision: Ember.computed.gt('failedDeprovisioningLogDrains.length', 0),
  showSortableHeader: Ember.computed.or('hasPending', 'hasDeprovisioning'),

  actions: {
    completedAction(message) {
      Ember.get(this, 'flashMessages').success(message);
    },

    failedAction(message) {
      Ember.get(this, 'flashMessages').danger(message);
    }
  }
});
