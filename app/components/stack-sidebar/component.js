import Ember from 'ember';

export default Ember.Component.extend({
  sortBy: ['handle:asc'],

  organizationStacks: Ember.computed('stacks.[]', function() {
    return this.get('stacks').filterBy('data.links.organization', this.get('organization.data.links.self'));
  }),

  sortedStacks: Ember.computed.sort('organizationStacks', 'sortBy')
});

