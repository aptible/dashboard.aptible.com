import Ember from 'ember';

export default Ember.Controller.extend({
  sortBy: ['name:asc'],
  filterValue: '',
  sortedMembers: Ember.computed.sort('model.users', 'sortBy')
});
