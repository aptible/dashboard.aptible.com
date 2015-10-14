import Ember from 'ember';
import { HOURS_PER_MONTH } from '../usage-quote-by-resource/component';

export default Ember.Component.extend({
  // Arrays of usage counts
  containers: Ember.computed.mapBy('stacks', 'containerCount'),
  domains: Ember.computed.mapBy('stacks', 'domainCount'),
  disk: Ember.computed.mapBy('stacks', 'totalDiskSize'),

  // Gross sums
  grossContainers: Ember.computed.sum('containers'),
  grossDomains: Ember.computed.sum('domains'),
  grossDisk: Ember.computed.sum('disk'),

  // Net sums
  netContainers: Ember.computed('grossContainers', 'billingDetail.containersInPlan', function() {
    return Math.max((this.get('grossContainers') - this.get('billingDetail.containersInPlan')), 0);
  }),
  netDomains: Ember.computed('grossDomains', 'billingDetail.domainsInPlan', function() {
    return Math.max((this.get('grossDomains') - this.get('billingDetail.domainsInPlan')), 0);
  }),
  netDisk: Ember.computed('grossDisk', 'billingDetail.diskSpaceInPlan', function() {
    return Math.max((this.get('grossDisk') - this.get('billingDetail.diskSpaceInPlan')), 0);
  }),

  // Total value
  total: Ember.computed('netContainers', 'netDomains', 'netDisk', 'billingDetail', 'billingDetail.planRate', function() {
    let billingDetail = this.get('billingDetail');
    let { containerCentsPerHour, domainCentsPerHour, diskCentsPerHour } = billingDetail.getProperties(
      ['containerCentsPerHour', 'domainCentsPerHour', 'diskCentsPerHour']);
    let { netContainers, netDomains, netDisk } = this.getProperties(
      ['netContainers', 'netDomains', 'netDisk']);

    return ((netContainers * containerCentsPerHour +
            netDomains * domainCentsPerHour +
            netDisk * diskCentsPerHour) * HOURS_PER_MONTH) +
            this.get('billingDetail.planRate');
  })
});
