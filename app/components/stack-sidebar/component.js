import Ember from 'ember';

export default Ember.Component.extend({
  sortBy: ['handle:asc'],

  tooltipTitle: Ember.computed('organization.name', function() {
    return `${this.get('organization.name')} Settings`;
  }),

  organizationStacks: Ember.computed('stacks.[]', function() {
    return this.get('stacks').filterBy('data.links.organization', this.get('organization.data.links.self'));
  }),

  sortedStacks: Ember.computed.sort('organizationStacks', 'sortBy')
});

