import Ember from 'ember';

export default Ember.Controller.extend({
  provisionedDomains: Ember.computed.filterBy('model', 'isProvisioned'),
  pendingDomains: Ember.computed.filterBy('model', 'isProvisioning'),
  deprovisionedDomains: Ember.computed.filterBy('model', 'hasBeenDeprovisioned'),
  hasActive: Ember.computed.gt('provisionedDomains.length', 0),
  hasPending: Ember.computed.gt('pendingDomains.length', 0),
  hasDeprovisioned: Ember.computed.gt('deprovisionedDomains.length', 0),
  showSortableHeader: Ember.computed.or('hasPending', 'hasDeprovisioning')
});
