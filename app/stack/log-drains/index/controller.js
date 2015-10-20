import Ember from 'ember';

export default Ember.Controller.extend({
  provisionedLogDrains: Ember.computed.filterBy('model', 'isProvisioned'),
  pendingLogDrains: Ember.computed.filterBy('model', 'isPending'),
  provisioningLogDrains: Ember.computed.filterBy('model', 'isProvisioning'),
  pendingOrProvisioningLogDrains: Ember.computed.union('provisioningLogDrains', 'pendingLogDrains'),
  deprovisionedLogDrains: Ember.computed.filterBy('model', 'hasBeenDeprovisioned'),
  hasActive: Ember.computed.gt('provisionedLogDrains.length', 0),
  hasPending: Ember.computed.gt('pendingOrProvisioningLogDrains.length', 0),
  hasDeprovisioning: Ember.computed.gt('deprovisionedLogDrains.length', 0),
  showSortableHeader: Ember.computed.or('hasPending', 'hasDeprovisioning')
});
