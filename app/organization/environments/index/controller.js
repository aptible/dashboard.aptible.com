import Ember from 'ember';

export default Ember.Controller.extend({
  sortBy: ['handle:asc'],

  activatedStacks: Ember.computed.filterBy('model', 'activated'),
  pendingStacks: Ember.computed.filterBy('model', 'pending'),

  sortedActivatedStacks: Ember.computed.sort('activatedStacks', 'sortBy'),
  sortedPendingStacks: Ember.computed.sort('pendingStacks', 'sortBy'),


  hasPending: Ember.computed.gt('pendingStacks.length', 0)
});
