import {
  moduleFor,
  test
} from 'ember-qunit';

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

import TrainingEnrollmentStatus from 'sheriff/utils/training-enrollment-status';

module('Unit: TrainingEnrollmentStatus');

let user = Ember.Object.create({});

test('it throws if not initialized correctly', function(assert) {
  assert.throws(function() {
    new TrainingEnrollmentStatus({})
  }, /must be included/);
});

test('filters required courses correctly', function(assert) {
  let settings = { isRobot: false, isDeveloper: true, isSecurityOfficer: true };
  let status = new TrainingEnrollmentStatus({ user, settings, documents: [] });
  let expected = ['Basic', 'Developer', 'Security'];

  assert.equal(status.get('requiredCourses.length'), 3, 'returns 3 required courses');
  assert.deepEqual(status.get('requiredCourses').mapBy('title'), expected, 'includes correct 3 courses');
});

test('filters completed courses correctly', function(assert) {
  let completedBasic = { criterion: { handle: 'training_log' },
                            expiresAt: fromNow({ years: 2 }),
                            createdAt: ago({ years: 1}) };
  let completedDeveloper = { criterion: { handle: 'developer_training_log' },
                             expiresAt: fromNow({ years: 2 }),
                             createdAt: ago({ years: 1}) };

  let documents = [Ember.Object.create(completedBasic), Ember.Object.create(completedDeveloper)];
  let settings = { isRobot: false, isDeveloper: true, isSecurityOfficer: false };
  let status = new TrainingEnrollmentStatus({ user, settings, documents });
  let expected = ['Basic', 'Developer'];

  assert.equal(status.get('completedCourses.length'), 2, 'returns 2 completed courses');
  assert.deepEqual(status.get('completedCourses').mapBy('title'), expected, 'includes correct 2 courses');
});

test('filters expired courses correctly', function(assert) {
  // Test missing expiry (defaults to 1 year)
  let expiredBasic = { criterion: { handle: 'training_log' },
                       createdAt: ago({ years: 2}) };

  // Test specific expiration
  let expiredDeveloper = { criterion: { handle: 'developer_training_log' },
                           expiresAt: ago({ years: 1 }),
                           createdAt: ago({ years: 2}) };
  let completedSecurity = { criterion: { handle: 'security_officer_training_log' },
                            expiresAt: fromNow({ years: 2 }),
                            createdAt: ago({ years: 1}) };

  let documents = [Ember.Object.create(expiredBasic), Ember.Object.create(expiredDeveloper), Ember.Object.create(completedSecurity)];
  let settings = { isRobot: false, isDeveloper: true, isSecurityOfficer: true };
  let status = new TrainingEnrollmentStatus({ user, settings, documents });
  let expected = ['Basic', 'Developer'];

  assert.equal(status.get('expiredCourses.length'), 2, 'returns 2 expired courses');
  assert.deepEqual(status.get('expiredCourses').mapBy('title'), expected, 'includes correct 2 courses');
});

test('filters overdue courses correctly', function(assert) {
  let expiredBasic = { criterion: { handle: 'training_log' },
                       createdAt: ago({ years: 2}) };
  let expiredDeveloper = { criterion: { handle: 'developer_training_log' },
                           expiresAt: ago({ years: 1 }),
                           createdAt: ago({ years: 2}) };

  let documents = [Ember.Object.create(expiredBasic), Ember.Object.create(expiredDeveloper)];
  let settings = { isRobot: false, isDeveloper: true, isSecurityOfficer: true };
  let status = new TrainingEnrollmentStatus({ user, settings, documents });
  let expected = ['Security'];

  assert.equal(status.get('overdueCourses.length'), 1, 'returns 1 overdue courses');
  assert.deepEqual(status.get('overdueCourses').mapBy('title'), expected, 'includes correct course');
});