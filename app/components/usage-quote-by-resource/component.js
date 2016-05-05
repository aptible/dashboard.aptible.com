import Ember from 'ember';

export const HOURS_PER_MONTH = 730;

export default Ember.Component.extend({
  resourceLabel: Ember.computed('resource', function() {
    return this.get('resource').capitalize().pluralize();
  }),

  containerUsage: Ember.computed.mapBy('stacks', 'containerUsage'),
  totalContainerUsage: Ember.computed.sum('containerUsage'),

  grossUsage: Ember.computed('resource', 'totalContainerUsage', function() {
    if(this.get('resource') === 'container') {
      return this.get('totalContainerUsage');
    }

    let total = 0;
    this.get('stacks').forEach((stack) => {
      total += stack.getUsageByResourceType(this.get('resource'));
    });
    return total;
  }),

  rate: Ember.computed('resource', 'hourlyRate', function() {
    if(this.get('resource') === 'disk') {
      let rate = (Math.round(this.get('hourlyRate') * HOURS_PER_MONTH)/100);
      return `$${rate.toFixed(2)}/GB per month`;
    } else {
      return `$${(this.get('hourlyRate')/100).toFixed(2)} per hour`;
    }
  }),

  netUsage: Ember.computed('grossUsage', 'allowance', 'resource', function() {
    return Math.max(this.get('grossUsage') - this.get('allowance'), 0);
  }),

  totalUsageCost: Ember.computed('resource', 'netUsage', 'hourlyRate', function() {
    return this.get('netUsage') * this.get('hourlyRate') * HOURS_PER_MONTH;
  })
});
