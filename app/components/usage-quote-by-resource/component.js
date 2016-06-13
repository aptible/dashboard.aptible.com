import Ember from 'ember';

export const HOURS_PER_MONTH = 730;

const RESOURCE_LABELS = {
  'domain': 'endpoint',
  'disk': 'disk',
  'container': 'container'
};

export default Ember.Component.extend({
  resourceHandle: Ember.computed('resource', function() {
    return this.get('resource').toLowerCase();
  }),

  resourceTitle: Ember.computed('resourceHandle', function() {
    return RESOURCE_LABELS[this.get('resourceHandle')].capitalize().pluralize();
  }),

  resourceLabel: Ember.computed('resourceHandle', function() {
    return RESOURCE_LABELS[this.get('resourceHandle')];
  }),

  diskUsage: Ember.computed.mapBy('stacks', 'totalDiskSize'),
  domainUsage: Ember.computed.mapBy('stacks', 'domainCount'),
  containerUsage: Ember.computed.mapBy('services', 'usage'),

  totalDiskUsage: Ember.computed.sum('diskUsage'),
  totalDomainUsage: Ember.computed.sum('domainUsage'),
  totalContainerUsage: Ember.computed.sum('containerUsage'),

  grossUsage: Ember.computed('resource', function() {
    switch(this.get('resource')) {
      case 'container':
        return this.get('totalContainerUsage');
      case 'disk':
        return this.get('totalDiskUsage');
      case 'domain':
        return this.get('totalDomainUsage');
    }
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
