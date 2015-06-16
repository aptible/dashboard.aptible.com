import Ember from 'ember';

export default Ember.Controller.extend({
  deployedApps: Ember.computed.filterBy('model', 'isProvisioned'),
  pendingApps: Ember.computed.filterBy('model', 'isPending'),
  deprovisionedApps: Ember.computed.filterBy('model', 'hasBeenDeprovisioned'),
  hasActive: Ember.computed.gt('deployedApps.length', 0),
  hasPending: Ember.computed.gt('pendingApps.length', 0),
  hasDeprovisioning: Ember.computed.gt('deprovisionedApps.length', 0),
  showSortableHeader: Ember.computed.or('hasPending', 'hasDeprovisioning')
});
