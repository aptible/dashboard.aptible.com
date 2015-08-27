import Ember from 'ember';

export const HOURS_PER_MONTH = 730;

export default Ember.Component.extend({
  resourceLabel: Ember.computed('resource', function() {
    return this.get('resource').capitalize().pluralize();
  }),

  grossUsage: Ember.computed('stacks.[]', function() {
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

  netUsage: Ember.computed('grossUsage', 'allowance', function() {
    return Math.max(this.get('grossUsage') - this.get('allowance'), 0);
  }),

  totalUsageCost: Ember.computed('netUsage', 'hourlyRate', function() {
    return this.get('netUsage') * this.get('hourlyRate') * HOURS_PER_MONTH;
  })
});
