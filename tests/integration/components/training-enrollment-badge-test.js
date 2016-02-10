import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { ENROLLMENT_STATUSES } from 'sheriff/components/training-enrollment-badge/component';

function fromNow(params, direction = 1) {
  let years = params.years || 0;
  let months = params.months || 0;
  let days = params.days || 0;
  let date = new Date();

  date.setYear(date.getFullYear() + (direction * years));
  date.setMonth(date.getMonth() + (direction * months));
  date.setDate(date.getDate() + (direction * days));

  return date;
}

function ago(params) {
  return fromNow(params, -1);
}

moduleForComponent('training-enrollment-badge', {
  integration: true
});

let user = Ember.Object.create({ });
let handle = 'developer_training_log';

test('renders for not enrolled', function(assert) {
  this.setProperties({ handle, user, required: false, documents: [] });
  this.render(hbs('{{training-enrollment-badge handle=handle user=user required=required documents=documents tagName="li"}}'));

  assert.ok(this.$('.badge').hasClass(`status-${ENROLLMENT_STATUSES.NOT_ENROLLED}`));
});

test('shows red when no training documents exist', function(assert) {
  this.setProperties({ handle, user, required: true, documents: [] });
  this.render(hbs('{{training-enrollment-badge handle=handle user=user required=required documents=documents tagName="li"}}'));

  assert.ok(this.$('.badge').hasClass(`status-${ENROLLMENT_STATUSES.OVERDUE}`));
});

test('shows orange when documents expired by specific expiry', function(assert) {
  let expiredDocument = Ember.Object.create({ createdAt: ago({ years: 1 }),
                                              expiresAt: ago({ months: 1 }),
                                              criterion: { handle } });

  let documents = [expiredDocument];

  this.setProperties({ handle, user, required: true, documents });
  this.render(hbs('{{training-enrollment-badge handle=handle user=user required=required documents=documents tagName="li"}}'));

  assert.ok(this.$('.badge').hasClass(`status-${ENROLLMENT_STATUSES.EXPIRED}`));
});

test('shows orange when documents expired by default expiry', function(assert) {
  let expiredDocument = Ember.Object.create({ createdAt: ago({ years: 2 }),
                                              criterion: { handle } });
  let documents = [expiredDocument];

  this.setProperties({ handle, user, required: true, documents });
  this.render(hbs('{{training-enrollment-badge handle=handle user=user required=required documents=documents tagName="li"}}'));

  assert.ok(this.$('.badge').hasClass(`status-${ENROLLMENT_STATUSES.EXPIRED}`));
});

test('shows green when non-expired documents present', function(assert) {
  let activeDocument = Ember.Object.create({ createdAt: ago({ months: 1 }),
                                             expiresAt: fromNow({ years: 1}),
                                             criterion: { handle } });
  let documents = [activeDocument];

  this.setProperties({ handle, user, required: true, documents });
  this.render(hbs('{{training-enrollment-badge handle=handle user=user required=required documents=documents tagName="li"}}'));

  assert.ok(this.$('.badge').hasClass(`status-${ENROLLMENT_STATUSES.COMPLETE}`));
});
