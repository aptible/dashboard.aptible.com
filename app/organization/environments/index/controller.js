import Ember from 'ember';

export default Ember.Controller.extend({
  activatedStacks: Ember.computed.filter('model', function(stack) {
    return stack.get('activated');
  }),
  pendingStacks: Ember.computed.filter('model', function(stack) {
    return !stack.get('activated');
  }),
  hasPending: Ember.computed.gt('pendingStacks.length', 0)
});
