import Ember from 'ember';

export default Ember.Component.extend({
  sortBy: ['handle:asc'],

  arrayChanged: function() {
    Ember.run.once(this, 'checkModelArray');
  }.observes('model.[]'),

  checkModelArray: function() {
    if(this.get('model').get('length') === 0) {
      this.sendAction('redirect');
    }
  },

  // Databases by status
  deployedDatabases: Ember.computed.filterBy('model', 'isProvisioned'),
  pendingDatabases: Ember.computed.filterBy('model', 'isProvisioning'),
  deprovisioningDatabases: Ember.computed.filterBy('model', 'isDeprovisioning'),

  deprovisionedDatabases: Ember.computed.filterBy('model', 'isDeprovisioned'),
  failedProvisionDatabases: Ember.computed.filterBy('model', 'hasFailedProvision'),
  failedDeprovisionDatabases: Ember.computed.filterBy('model', 'hasFailedDeprovision'),

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
  showSortableHeader: Ember.computed.or('hasPending', 'hasDeprovisioning', 'hasFailedProvision', 'hasFailedProvision'),

  actions: {
    redirect() {
      this.sendAction('forceRedirect');
    }
  }
});
