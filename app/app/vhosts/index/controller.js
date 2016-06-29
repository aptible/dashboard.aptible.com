import Ember from 'ember';

export default Ember.Controller.extend({
  provisionedDomains: Ember.computed.filterBy('model', 'isProvisioned'),

  activeDomains: Ember.computed.filterBy('provisionedDomains', 'hasActionRequired', false),
  actionRequiredDomains: Ember.computed.filterBy('provisionedDomains', 'hasActionRequired'),
  pendingDomains: Ember.computed.filterBy('model', 'isProvisioning'),
  deprovisionedDomains: Ember.computed.filterBy('model', 'hasBeenDeprovisioned'),

  hasActive: Ember.computed.gt('activeDomains.length', 0),
  hasActionRequired: Ember.computed.gt('actionRequiredDomains.length', 0),
  hasPending: Ember.computed.gt('pendingDomains.length', 0),
  hasDeprovisioned: Ember.computed.gt('deprovisionedDomains.length', 0),

  showSortableHeader: Ember.computed.or('hasActionRequired', 'hasPending', 'hasDeprovisioning')
});
