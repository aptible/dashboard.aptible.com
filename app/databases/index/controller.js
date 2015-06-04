import Ember from 'ember';

export default Ember.Controller.extend({
  deployedDatabases: Ember.computed.filter('model', function(database) {
    return database.get('isProvisioned');
  }),
  pendingDatabases: Ember.computed.filter('model', function(database) {
    return database.get('isProvisioning');
  }),
  deprovisionedDatabases: Ember.computed.filter('model', function(database) {
    return database.get('hasBeenDeprovisioned');
  }),
  hasActive: Ember.computed.gt('deployedDatabases.length', 0),
  hasPending: Ember.computed.gt('pendingDatabases.length', 0),
  hasDeprovisioned: Ember.computed.gt('deprovisionedDatabases.length', 0),
  showSortableHeader: Ember.computed.or('hasPending', 'hasDeprovisioning')
});
