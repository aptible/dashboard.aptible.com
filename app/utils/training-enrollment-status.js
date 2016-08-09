import Ember from 'ember';
import CriterionStatusMixin from 'diesel/mixins/services/criterion-status';
export const COURSE_NAMES = { training_log: 'Basic',
                              developer_training_log: 'Developer',
                              security_officer_training_log: 'Security' };
export const ENROLLMENT_STATUSES = {
  NOT_ENROLLED: 'notEnrolled',
  COMPLETE: 'complete',
  EXPIRED: 'expired',
  OVERDUE: 'overdue'
};

export var CourseEnrollmentStatus = Ember.Object.extend(CriterionStatusMixin, {
  init(params) {
    this._super(...arguments);

    let { title, handle, documents, user, settings } = params;

    Ember.assert('`documents` must be included in `CourseEnrollmentStatus` initialization params', documents);
    Ember.assert('`user` must be included in `CourseEnrollmentStatus` initialization params', user);
    Ember.assert('`settings` must be included in `CourseEnrollmentStatus` initialization params', settings);
    Ember.assert('`title` must be included in `CourseEnrollmentStatus` initialization params', title);
    Ember.assert('`handle` must be included in `CourseEnrollmentStatus` initialization params', handle);

    this.setProperties({ title, handle, documents, user, settings });
  },

  criterionDocuments: Ember.computed('handle', 'documents.[]', function() {
    let handle = this.get('handle');

    return this.get('documents').filter((document) => {
      return document.get('criterion.handle') === handle;
    });
  }),

  required: Ember.computed('settings', 'handle', function() {
    let handle = this.get('handle');
    let settings = this.get('settings');

    switch(handle) {
      case 'training_log':
      return true;
      case 'developer_training_log':
      return settings.isDeveloper;
      case 'security_officer_training_log':
      return settings.isSecurityOfficer;
    }
  }),

  enrollmentStatus: Ember.computed('activeCriterionDocuments.[]', 'required', 'criterionDocuments.[]', function() {
    if (this.get('activeCriterionDocuments.length') > 0) {
      // Has non-expired documents related to this criterion
      return ENROLLMENT_STATUSES.COMPLETE;
    }

    if (!this.get('required')) {
      // This training is not required
      return ENROLLMENT_STATUSES.NOT_ENROLLED;
    }

    if (this.get('criterionDocuments.length') === 0) {
      // Has no training documents related to this criterion
      return ENROLLMENT_STATUSES.OVERDUE;
    }

    return ENROLLMENT_STATUSES.EXPIRED;
  })
});

export default Ember.Object.extend({
  init(params) {
    this._super(...arguments);

    let courses = {};
    let coursesCollection = [];
    let { documents, user, settings } = params;

    Ember.assert('`documents` must be included in `TrainingEnrollmentStatus` initialization params', !!documents);
    Ember.assert('`user` must be included in `TrainingEnrollmentStatus` initialization params', !!user);
    Ember.assert('`settings` must be included in `TrainingEnrollmentStatus` initialization params', !!settings);

    for (var handle in COURSE_NAMES) {
      let title = COURSE_NAMES[handle];

      courses[handle] = new CourseEnrollmentStatus({
        title, handle, documents, user, settings
      });
      coursesCollection.push(courses[handle]);
    }

    this.setProperties({ courses, coursesCollection, documents, user, settings });
  },

  requiredCourses: Ember.computed.filterBy('coursesCollection', 'required', true),
  completedCourses: Ember.computed.filterBy('coursesCollection', 'enrollmentStatus', ENROLLMENT_STATUSES.COMPLETE),
  expiredCourses: Ember.computed.filterBy('coursesCollection', 'enrollmentStatus', ENROLLMENT_STATUSES.EXPIRED),
  overdueCourses: Ember.computed.filterBy('coursesCollection', 'enrollmentStatus', ENROLLMENT_STATUSES.OVERDUE)
});