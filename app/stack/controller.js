import Ember from "ember";

export default Ember.Controller.extend({
  // FIXME: app and database creation pages are dependent on these
  // CPs being defined.
  persistedApps: Ember.computed.filterBy('model.apps', 'isNew', false),
  persistedCertificates: Ember.computed.filterBy('model.certificates', 'isNew', false),
  persistedDatabases: Ember.computed.filterBy('model.databases', 'isNew', false)
});
