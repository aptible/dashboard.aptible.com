import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  sortBy: ['handle:asc'],
  sortedApps: Ember.computed.sort('stack.apps', 'sortBy'),
  sortedDatabases: Ember.computed.sort('stack.databases', 'sortBy')
});
