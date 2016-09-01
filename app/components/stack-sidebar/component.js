import Ember from 'ember';

export default Ember.Component.extend({
  sortBy: ['handle:asc'],
  sortedStacks: Ember.computed.sort('authorizationContext.stacks', 'sortBy')
});

