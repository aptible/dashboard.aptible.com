import Ember from 'ember';
import Database from 'diesel/models/database';
import App from 'diesel/models/app';

export default Ember.Component.extend({
  tagName: '',
  sortBy: ['handle:asc'],
  sortedApps: Ember.computed.sort('stack.apps', 'sortBy'),
  sortedDatabases: Ember.computed.sort('stack.databases', 'sortBy'),
  isDatabaseResource: Ember.computed('resource', function() {
    return this.get('resource') instanceof Database;
  }),

  isAppResource: Ember.computed('resource', function() {
    return this.get('resource') instanceof App;
  }),

  backLink: Ember.computed('isDatabaseResource', 'isAppResource', function() {
    let backLink =  'stack';

    if(this.get('isDatabaseResource')) {
      backLink = 'databases';
    }

    if(this.get('isAppResource')) {
      backLink = 'apps';
    }

    return backLink;
  })
});
