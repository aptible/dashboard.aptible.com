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
  netContainers: Ember.computed('grossContainers', 'billingDetail.containerAllowance', function() {
    return Math.max((this.get('grossContainers') - this.get('billingDetail.containerAllowance')), 0);
  }),
  netDomains: Ember.computed('grossDomains', 'billingDetail.domainAllowance', function() {
    return Math.max((this.get('grossDomains') - this.get('billingDetail.domainAllowance')), 0);
  }),
  netDisk: Ember.computed('grossDisk', 'billingDetail.diskAllowance', function() {
    return Math.max((this.get('grossDisk') - this.get('billingDetail.diskAllowance')), 0);
  }),

  // Total value
  total: Ember.computed('netContainers', 'netDomains', 'netDisk', 'billingDetail', function() {
    let billingDetail = this.get('billingDetail');
    let { containerCentsPerHour, domainCentsPerHour, diskCentsPerHour } = billingDetail.getProperties(
      ['containerCentsPerHour', 'domainCentsPerHour', 'diskCentsPerHour']);
    let { netContainers, netDomains, netDisk } = this.getProperties(
      ['netContainers', 'netDomains', 'netDisk']);

    return (netContainers * containerCentsPerHour +
            netDomains * domainCentsPerHour +
            netDisk * diskCentsPerHour) * HOURS_PER_MONTH;
  }),

  totalDollars: Ember.computed('total', 'billingDetail.planRate', function() {
    return ((this.get('total') / 100) + this.get('billingDetail.planRate')).toFixed(2);
  })
});
