import Ember from "ember";

export default Ember.Controller.extend({
  hasMultipleStacks: Ember.computed.gt('stacks.length', 1),

  persistedApps: Ember.computed.filterBy('model.apps', 'isNew', false),
  persistedDatabases: Ember.computed.filterBy('model.databases', 'isNew', false)

});
