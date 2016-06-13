import Ember from 'ember';

export default Ember.Controller.extend({
  sortBy: ['email:asc'],
  sortedInvites: Ember.computed.sort('invitations', 'sortBy')
});
