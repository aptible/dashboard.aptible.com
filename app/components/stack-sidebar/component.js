import Ember from 'ember';

export default Ember.Component.extend({
  sortBy: ['handle:asc'],

  tooltipTitle: function() {
    return `${this.get('organization.name')} Settings`;
  }.property('organization.name'),
  organizationStacks: function() {
    return this.get('stacks').filterBy('organization.id', this.get('organization.id'));
  }.property('stacks.@each.organization.id', 'organization.id'),

  sortedStacks: Ember.computed.sort('organizationStacks', 'sortBy')
});
