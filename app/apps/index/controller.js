import Ember from 'ember';

export default Ember.Controller.extend({
  deployedApps: Ember.computed.filter('model', function(app) {
    return app.get('isProvisioned');
  }),
  pendingApps: Ember.computed.filter('model', function(app) {
    return app.get('isPending');
  }),
  deprovisionedApps: Ember.computed.filter('model', function(app) {
    return app.get('isDeprovisioning') || app.get('isDeprovisioned');
  }),
  hasActive: Ember.computed.gt('deployedApps.length', 0),
  hasPending: Ember.computed.gt('pendingApps.length', 0),
  hasDeprovisioning: Ember.computed.gt('deprovisionedApps.length', 0),
  showSortableHeader: Ember.computed.or('hasPending', 'hasDeprovisioning')
});
