import Ember from 'ember';

export default Ember.Controller.extend({
  activatedStacks: Ember.computed.filterBy('model', 'activated'),
  pendingStacks: Ember.computed.filterBy('model', 'pending'),
  hasPending: Ember.computed.gt('pendingStacks.length', 0)
});
