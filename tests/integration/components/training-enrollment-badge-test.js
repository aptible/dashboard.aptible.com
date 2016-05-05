import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { ENROLLMENT_STATUSES } from 'diesel/utils/training-enrollment-status';

moduleForComponent('training-enrollment-badge', {
  integration: true
});

test('renders status class based off course status', function(assert) {
  let user = {};
  let courseStatus = Ember.Object.create({ enrollmentStatus: ENROLLMENT_STATUSES.NOT_ENROLLED,
                                           title: 'Security' });
  this.setProperties({ user, courseStatus});
  this.render(hbs('{{training-enrollment-badge user=user courseStatus=courseStatus tagName="li"}}'));

  assert.ok(this.$('.badge').hasClass(`status-${ENROLLMENT_STATUSES.NOT_ENROLLED}`));
  assert.equal($.trim(this.$('.badge').text()), 'Security');
});
