import Ember from 'ember';

export default Ember.Controller.extend({
  sortBy: ['handle:asc'],

  // Apps by status
  deployedApps: Ember.computed.filterBy('model', 'isProvisioned'),
  pendingApps: Ember.computed.filterBy('model', 'isPending'),
  deprovisionedApps: Ember.computed.filterBy('model', 'hasBeenDeprovisioned'),
  failedDeprovisionApps: Ember.computed.filterBy('model', 'hasFailedDeprovision'),

  // Sorted apps by status
  sortedDeployedApps: Ember.computed.sort('deployedApps', 'sortBy'),
  sortedPendingApps: Ember.computed.sort('pendingApps', 'sortBy'),
  sortedDeprovisionedApps: Ember.computed.sort('deprovisionedApps', 'sortBy'),
  sortedFailedDeprovisionApps: Ember.computed.sort('failedDeprovisionApps', 'sortBy'),

  hasActive: Ember.computed.gt('deployedApps.length', 0),
  hasPending: Ember.computed.gt('pendingApps.length', 0),
  hasDeprovisioning: Ember.computed.gt('deprovisionedApps.length', 0),
  hasFailedDeprovision: Ember.computed.gt('failedDeprovisionApps.length', 0),
  showSortableHeader: Ember.computed.or('hasPending', 'hasDeprovisioning')
});
