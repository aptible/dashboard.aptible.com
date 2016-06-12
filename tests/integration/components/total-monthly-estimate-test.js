import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('total-monthly-estimate', {
  integration: true
});

test('sums usage correctly', function(assert) {
  let stack1 = Ember.Object.create({ handle: 'stack1',  containerCount: 11, domainCount: 8, totalDiskSize: 2000 });
  let stack2 = Ember.Object.create({ handle: 'stack2',  containerCount: 3, domainCount: 1, totalDiskSize: 1000 });
  let billingDetail = Ember.Object.create({ containersInPlan: 6, domainsInPlan: 4,
                                            diskSpaceInPlan: 1000, containerCentsPerHour: 8,
                                            domainCentsPerHour: 5, diskCentsPerHour: 0.0507, planRate: 0 });

  // Net container rate: (11 + 3 - 6) * 8 * 730 = 46720
  // Net endpoint rate: (8 + 1 - 4) * 5 * 730 = 18250
  // Net disk rate: (2000 + 1000 - 1000) * .0507 * 730 = 74022
  // Net cents: 138992
  // net dollars: $1,389.92

  this.set('stacks', [stack1, stack2]);
  this.set('billingDetail', billingDetail);
  this.render(hbs('{{total-monthly-estimate stacks=stacks billingDetail=billingDetail}}'));

  assert.equal(this.$().text().trim(), '$1,389.92', 'has correct total value');
});

test('sums usage with base plan rate correctly', function(assert) {
  let stack1 = Ember.Object.create({ handle: 'stack1',  containerCount: 11, domainCount: 8, totalDiskSize: 2000 });
  let stack2 = Ember.Object.create({ handle: 'stack2',  containerCount: 3, domainCount: 1, totalDiskSize: 1000 });
  let billingDetail = Ember.Object.create({ containersInPlan: 6, domainsInPlan: 4,
                                            diskSpaceInPlan: 1000, containerCentsPerHour: 8,
                                            domainCentsPerHour: 5, diskCentsPerHour: 0.0507, planRate: 349900 });

  // Net container rate: (11 + 3 - 6) * 8 * 730 = 46720
  // Net endpoint rate: (8 + 1 - 4) * 5 * 730 = 18250
  // Net disk rate: (2000 + 1000 - 1000) * .0507 * 730 = 74022
  // Net plan rate 349900
  // Net cents: 488892
  // net dollars: $4,888.92

  this.set('stacks', [stack1, stack2]);
  this.set('billingDetail', billingDetail);
  this.render(hbs('{{total-monthly-estimate stacks=stacks billingDetail=billingDetail}}'));

  assert.equal(this.$().text().trim(), '$4,888.92', 'has correct total value');
});
