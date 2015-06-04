import Ember from 'ember';

export default Ember.Controller.extend({
  deployedDatabases: Ember.computed.filterBy('model', 'isProvisioned'),
  pendingDatabases: Ember.computed.filterBy('model', 'isProvisioning'),
  deprovisionedDatabases: Ember.computed.filterBy('model', 'hasBeenDeprovisioned'),
  hasActive: Ember.computed.gt('deployedDatabases.length', 0),
  hasPending: Ember.computed.gt('pendingDatabases.length', 0),
  hasDeprovisioned: Ember.computed.gt('deprovisionedDatabases.length', 0),
  showSortableHeader: Ember.computed.or('hasPending', 'hasDeprovisioning')
});
