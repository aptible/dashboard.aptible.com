import Ember from 'ember';

export default Ember.Controller.extend({
  newDatabase: null, // Set this to open new db modal
  diskSize: 10,
  sortBy: ['handle:asc'],

  persistedDatabases: Ember.computed.filterBy('model', 'isNew', false),
  hasNoDatabases: Ember.computed.equal('persistedDatabases.length', 0),
  deployedDatabases: Ember.computed.filterBy('persistedDatabases', 'isProvisioned'),
  pendingDatabases: Ember.computed.filterBy('persistedDatabases', 'isProvisioning'),
  deprovisioningDatabases: Ember.computed.filterBy('persistedDatabases', 'isDeprovisioning'),

  deprovisionedDatabases: Ember.computed.filterBy('persistedDatabases', 'isDeprovisioned'),
  failedProvisionDatabases: Ember.computed.filterBy('persistedDatabases', 'hasFailedProvision'),
  failedDeprovisionDatabases: Ember.computed.filterBy('persistedDatabases', 'hasFailedDeprovision'),

  // Sorted databases by status
  sortedDeployedDatabases: Ember.computed.sort('deployedDatabases', 'sortBy'),
  sortedDeprovisioningDatabases: Ember.computed.sort('deprovisioningDatabases', 'sortBy'),
  sortedPendingDatabases: Ember.computed.sort('pendingDatabases', 'sortBy'),
  sortedDeprovisionedDatabases: Ember.computed.sort('deprovisionedDatabases', 'sortBy'),
  sortedFailedProvisionDatabases: Ember.computed.sort('failedProvisionDatabases', 'sortBy'),
  sortedFailedDeprovisionDatabases: Ember.computed.sort('failedDeprovisionDatabases', 'sortBy'),

  hasActive: Ember.computed.gt('deployedDatabases.length', 0),
  hasPending: Ember.computed.gt('pendingDatabases.length', 0),
  hasDeprovisioning: Ember.computed.gt('deprovisioningDatabases.length', 0),
  hasDeprovisioned: Ember.computed.gt('deprovisionedDatabases.length', 0),
  hasFailedProvision: Ember.computed.gt('failedProvisionDatabases.length', 0),
  hasFailedDeprovision: Ember.computed.gt('failedDeprovisionDatabases.length', 0),
  showSortableHeader: Ember.computed.or('hasPending', 'hasDeprovisioning', 'hasFailedProvision', 'hasFailedProvision')
});
