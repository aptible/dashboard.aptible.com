import Ember from 'ember';

export default Ember.Controller.extend({
  provisionedDomains: Ember.computed.filter('model', function(vhost) {
    return vhost.get('isProvisioned');
  }),
  pendingDomains: Ember.computed.filter('model', function(vhost) {
    return vhost.get('isProvisioning');
  }),
  deprovisionedDomains: Ember.computed.filter('model', function(vhost) {
    return vhost.get('hasBeenDeprovisioned');
  }),
  hasActive: Ember.computed.gt('provisionedDomains.length', 0),
  hasPending: Ember.computed.gt('pendingDomains.length', 0),
  hasDeprovisioned: Ember.computed.gt('deprovisionedDomains.length', 0),
  showSortableHeader: Ember.computed.or('hasPending', 'hasDeprovisioning')
});
