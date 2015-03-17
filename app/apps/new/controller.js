import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['stack'],
  persistedApps: Ember.computed.alias('controllers.stack.persistedApps'),
  showCancelButton: Ember.computed.gt('persistedApps.length', 0)
});
