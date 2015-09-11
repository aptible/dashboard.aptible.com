import Ember from 'ember';

export default Ember.Controller.extend({
  sortBy: ['name:asc'],
  invitesSortBy: ['email:asc'],

  sortedMembers: Ember.computed.sort('model', 'sortBy'),
  sortedInvites: Ember.computed.sort('organization.invitations', 'invitesSortBy')
});
