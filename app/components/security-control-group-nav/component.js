import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  dataEnvironmentGroups: Ember.computed.filterBy('groups', 'type', 'data-environment'),
  organizationalGroups: Ember.computed.filterBy('groups', 'type', 'organization')
});
