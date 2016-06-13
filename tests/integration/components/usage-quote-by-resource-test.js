import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('usage-quote-by-resource', {
  integration: true
});

test('basic attributes are set', function(assert) {
  let stack = Ember.Object.create({ handle: 'stack1', apps: [], containerUsage: 10 });
  this.set('stacks', [stack]);
  this.render(hbs('{{usage-quote-by-resource stacks=stacks allowance=6 hourlyRate=8 plan="platform" resource="container"}}'));

  let title = this.$('.resource-label');
  let rate = this.$('.resource-rate');
  let stackHandle = this.$('.stack-handle');
  assert.equal(title.text(), 'Containers', 'has a resource title');
  assert.equal(rate.text(), '$0.08 per hour', 'has a resource rate');
  assert.equal($.trim(stackHandle.text()), 'stack1', 'has a stack');
});

test('container usage less than allowance results in 0 billing', function(assert) {
  let stack1 = Ember.Object.create({ handle: 'stack1', apps: [], containerUsage: 2 });
  let stack2 = Ember.Object.create({ handle: 'stack2', apps: [], containerUsage: 3 });
  let service1 = Ember.Object.create({ usage: 2 });
  let service2 = Ember.Object.create({ usage: 3 });
  this.set('stacks', [stack1, stack2]);
  this.set('services', [service1, service2]);
  this.render(hbs('{{usage-quote-by-resource stacks=stacks services=services allowance=6 hourlyRate=8 plan="platform" resource="container"}}'));

  let total = this.$('.resource-usage-total .usage-value');
  let allowance = this.$('.allowance');
  let net = this.$('.net-usage');
  let resourceRate = this.$('.resource-rate');

  assert.equal($.trim(total.text()), '$0.00', 'has 0 billing total');
  assert.equal(allowance.text(), '-6', 'has an allowance');
  assert.equal(net.text(), '0', 'has 0 net usage');
  assert.equal($.trim(resourceRate.text()), '$0.08 per hour', 'has a resource rate');
});

test('container usage equal to allowance results in 0 billing', function(assert) {
  let stack1 = Ember.Object.create({ handle: 'stack1', apps: [], containerUsage: 3 });
  let stack2 = Ember.Object.create({ handle: 'stack2', apps: [], containerUsage: 3 });
  let service1 = Ember.Object.create({ usage: 3 });
  let service2 = Ember.Object.create({ usage: 3 });
  this.set('stacks', [stack1, stack2]);
  this.set('services', [service1, service2]);
  this.render(hbs('{{usage-quote-by-resource stacks=stacks services=services allowance=6 hourlyRate=8 plan="platform" resource="container"}}'));

  let total = this.$('.resource-usage-total .usage-value');
  let allowance = this.$('.allowance');
  let net = this.$('.net-usage');

  assert.equal($.trim(total.text()), '$0.00', 'has 0 billing total');
  assert.equal(allowance.text(), '-6', 'has an allowance');
  assert.equal(net.text(), '0', 'has 0 net usage');
});

test('container usage exceeding allowance results in overage billing', function(assert) {
  let stack1 = Ember.Object.create({ handle: 'stack1', apps: [], containerUsage: 8 });
  let stack2 = Ember.Object.create({ handle: 'stack2', apps: [], containerUsage: 9 });
  let service1 = Ember.Object.create({ usage: 8 });
  let service2 = Ember.Object.create({ usage: 9 });
  this.set('stacks', [stack1, stack2]);
  this.set('services', [service1, service2]);
  this.render(hbs('{{usage-quote-by-resource stacks=stacks services=services allowance=6 hourlyRate=8 plan="platform" resource="container"}}'));

  let total = this.$('.resource-usage-total .usage-value');
  let allowance = this.$('.allowance');
  let net = this.$('.net-usage');

  assert.equal($.trim(total.text()), '$642.40', 'has overage billing total');
  assert.equal(allowance.text(), '-6', 'has an allowance');
  assert.equal(net.text(), '11', 'has 11 net usage');
});

test('disk usage less than allowance results in 0 billing', function(assert) {
  let stack1 = Ember.Object.create({ handle: 'stack1', databases: [], totalDiskSize: 200 });
  let stack2 = Ember.Object.create({ handle: 'stack2', databases: [], totalDiskSize: 300 });
  this.set('stacks', [stack1, stack2]);
  this.render(hbs('{{usage-quote-by-resource stacks=stacks allowance=1000 hourlyRate=0.0507 plan="platform" resource="disk"}}'));

  let total = this.$('.resource-usage-total .usage-value');
  let allowance = this.$('.allowance');
  let net = this.$('.net-usage');
  let resourceRate = this.$('.resource-rate');

  assert.equal($.trim(total.text()), '$0.00', 'has 0 billing total');
  assert.equal(allowance.text(), '-1000', 'has an allowance');
  assert.equal(net.text(), '0', 'has 0 net usage');
  assert.equal($.trim(resourceRate.text()), '$0.37/GB per month', 'has a resource rate');
});

test('disk usage equal to allowance results in 0 billing', function(assert) {
  let stack1 = Ember.Object.create({ handle: 'stack1', databases: [], totalDiskSize: 200 });
  let stack2 = Ember.Object.create({ handle: 'stack2', databases: [], totalDiskSize: 800 });
  this.set('stacks', [stack1, stack2]);
  this.render(hbs('{{usage-quote-by-resource stacks=stacks allowance=1000 hourlyRate=0.0507 plan="platform" resource="disk"}}'));

  let total = this.$('.resource-usage-total .usage-value');
  let allowance = this.$('.allowance');
  let net = this.$('.net-usage');

  assert.equal($.trim(total.text()), '$0.00', 'has 0 billing total');
  assert.equal(allowance.text(), '-1000', 'has an allowance');
  assert.equal(net.text(), '0', 'has 0 net usage');
});

test('disk usage exceeding allowance results in overage billing', function(assert) {
  let stack1 = Ember.Object.create({ handle: 'stack1', databases: [], totalDiskSize: 800 });
  let stack2 = Ember.Object.create({ handle: 'stack2', databases: [], totalDiskSize: 900 });
  this.set('stacks', [stack1, stack2]);
  this.render(hbs('{{usage-quote-by-resource stacks=stacks allowance=1000 hourlyRate=0.0507 plan="platform" resource="disk"}}'));

  let total = this.$('.resource-usage-total .usage-value');
  let allowance = this.$('.allowance');
  let net = this.$('.net-usage');
  assert.equal($.trim(total.text()), '$259.08', 'has overage billing total');
  assert.equal(allowance.text(), '-1000', 'has an allowance');
  assert.equal(net.text(), '700', 'has 700 net usage');
});
