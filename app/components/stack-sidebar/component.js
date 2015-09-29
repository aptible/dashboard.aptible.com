import Ember from 'ember';

export default Ember.Component.extend({
  sortBy: ['handle:asc'],

  tooltipTitle: Ember.computed('organization.name', function() {
    return `${this.get('organization.name')} Settings`;
  }),

  organizationStacks: Ember.computed('stacks.[]', function() {
    // Our current version of Ember Data + Ember Data HAL 9000 has issues
    // resolving resources that are already resolved in the store.  This leads
    // to multiple redundant requests.

    // TODO: Upgrade Ember Data and Ember Data HAL 9000 so accessing links directly is not required here.
    // Once upgraded, this can revert back to:
    // return this.get('stacks').filterBy('organization.id', this.get('organization.id'));
    // once EmberData has been upgraded.
    return this.get('stacks').filterBy('data.links.organization', this.get('organization.data.links.self'));
  }),

  sortedStacks: Ember.computed.sort('organizationStacks', 'sortBy')
});

