import Ember from 'ember';

export default Ember.Controller.extend({
  dataEnvironmentGroups: Ember.computed.filterBy('model', 'type', 'data-environment'),
  organizationalGroups: Ember.computed.filterBy('model', 'type', 'organization')
});
