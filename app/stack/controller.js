import Ember from "ember";

export default Ember.Controller.extend({
  hasMultipleStacks: Ember.computed.gt('stacks.length', 1),
  // FIXME: app and database creation pages are dependent on these
  // CPs being defined.
  persistedApps: Ember.computed.filterBy('model.apps', 'isNew', false),
  persistedDatabases: Ember.computed.filterBy('model.databases', 'isNew', false)
});
