import Ember from 'ember';
import { formatUtcTimestamp } from 'sheriff/helpers/format-utc-timestamp'

export const ENROLLMENT_STATUSES = {
  NOT_ENROLLED: 'notEnrolled',
  COMPLETE: 'complete',
  EXPIRED: 'expired',
  OVERDUE: 'overdue'
};
export const DEFAULT_DOCUMENT_EXPIRY_IN_YEARS = 1;
export const COURSE_NAMES = { training_log: 'Basic',
                              developer_training_log: 'Developer',
                              security_officer_training_log: 'Security' };



function formatDate(date) {
  return formatUtcTimestamp(date, true);
}

export default Ember.Component.extend({
  classNames: ['training-enrollment-badge'],
  name: Ember.computed('handle', function() {
    return COURSE_NAMES[this.get('handle')];
  }),

  criterionDocuments: Ember.computed('handle', 'documents.[]', function() {
    let handle = this.get('handle');

    return this.get('documents').filter((document) => {
      return document.get('criterion.handle') === handle;
    });
  }),

  activeCriterionDocuments: Ember.computed('criterionDocuments.[]', function() {
    return this.get('criterionDocuments').filter((document) => {
      // if document has an expiry, check if today is > doc.expiry
      // if document has no expirey, check if today is > doc.createdAt + 1 year

      let defaultExpiration = new Date(document.get('createdAt').getTime());
      defaultExpiration.setYear(defaultExpiration.getFullYear() + DEFAULT_DOCUMENT_EXPIRY_IN_YEARS);

      let expiresAt = document.get('expiresAt') || defaultExpiration;

      return new Date() < expiresAt;
    });
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
  }),

  lastCompletedDate: Ember.computed('activeCriterionDocuments.[]', function() {
    let completedDate = this.get('activeCriterionDocuments.firstObject.createdAt');

    if (completedDate) {
      return formatDate(completedDate);
    }
  }),

  lastCompletedExpirationDate: Ember.computed('activeCriterionDocuments.[]', function() {
    let expiresDate = this.get('activeCriterionDocuments.firstObject.expiresAt');

    if (expiresDate) {
      return formatDate(expiresDate);
    }
  }),

  lastExpirationDate: Ember.computed('criterionDocuments.[]', function() {
    let lastExpired = this.get('criterionDocuments.firstObject.expiresAt');

    if(lastExpired) {
      return formatDate(lastExpired);
    }
  }),

  hoverMessage: Ember.computed('enrollmentStatus', 'user', function() {
    let name = this.get('user.name');
    let course = COURSE_NAMES[this.get('handle')];
    let status = this.get('enrollmentStatus');
    let lastCompletedDate = this.get('lastCompletedDate');
    let lastCompletedExpirationDate = this.get('lastCompletedExpirationDate'); // Date that most recent document will expire
    let lastExpirationDate = this.get('lastExpirationDate');

    switch(status) {
      case ENROLLMENT_STATUSES.NOT_ENROLLED:
      return `${name} is not enrolled in ${course} Training.`
      case ENROLLMENT_STATUSES.COMPLETE:
      return `${name} last completed ${course} Training on ${lastCompletedDate}.`
      case ENROLLMENT_STATUSES.EXPIRED:
      return `${name} completed ${course} Training, but their training expired on ${lastExpirationDate}. ${name} should retake ${course} Training immediately.`
      case ENROLLMENT_STATUSES.OVERDUE:
      return `${name} is assigned ${course} Training, but never completed it. ${course} Training is due immediately.`
    }

  })
});
