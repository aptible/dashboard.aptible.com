import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('log-drain-actions', { integration: true });

let logDrain = Ember.Object.create({
  id: 'drain-1',
  handle: 'drain-1',
  drainHost: 'example.com',
  drainPort: '1234',
  drainType: 'syslog_tls_tcp'
});

let failedAction, completedAction = function() { };

test('shows reset and deprovisioned actions for provisioned log drains', function(assert) {
  logDrain.setProperties({ status: 'provisioned', isProvisioned: true, hasBeenDeprovisioned: false });
  this.setProperties({ failedAction: failedAction, completedAction: completedAction, logDrain: logDrain });
  this.render(hbs('{{log-drain-actions logDrain=logDrain completedAction="completedAction" failedAction="failedAction"}}'));

  assert.equal(this.$('.panel-heading-actions button').length, 2);
  assert.equal(this.$('.panel-heading-actions button:contains("Deprovision")').length, 1);
  assert.equal(this.$('.panel-heading-actions button:contains("Restart")').length, 1);
});

test('shows only deprovisioned action for provisioning log drains', function(assert) {
  logDrain.setProperties({ status: 'provisioning', isProvisioned: false, hasBeenDeprovisioned: false });
  this.setProperties({ failedAction: failedAction, completedAction: completedAction, logDrain: logDrain });
  this.render(hbs('{{log-drain-actions logDrain=logDrain completedAction="completedAction" failedAction="failedAction"}}'));

  assert.equal(this.$('.panel-heading-actions button').length, 1);
  assert.equal(this.$('.panel-heading-actions button:contains("Deprovision")').length, 1);
  assert.equal(this.$('.panel-heading-actions button:contains("Restart")').length, 0);
});

test('shows no actions for deprovisioning log drains', function(assert) {
  logDrain.setProperties({ status: 'deprovisioning', isProvisioned: false, hasBeenDeprovisioned: true });
  this.setProperties({ failedAction: failedAction, completedAction: completedAction, logDrain: logDrain });
  this.render(hbs('{{log-drain-actions logDrain=logDrain completedAction="completedAction" failedAction="failedAction"}}'));

  assert.equal(this.$('.panel-heading-actions button').length, 0);
  assert.equal(this.$('.panel-heading-actions button:contains("Deprovision")').length, 0);
  assert.equal(this.$('.panel-heading-actions button:contains("Restart")').length, 0);
});
