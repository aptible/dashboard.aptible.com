import Ember from 'ember';

export default Ember.Controller.extend({
  stack: Ember.inject.controller(),
  showCancelButton: Ember.computed.gt('stack.persistedApps.length', 0)
});
