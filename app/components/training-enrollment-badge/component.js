import Ember from 'ember';
import { ENROLLMENT_STATUSES } from 'diesel/utils/training-enrollment-status';

// Need to refactor this badge to work with new compliance status setup


export default Ember.Component.extend({
  classNames: ['training-enrollment-badge'],

  enrollmentStatus: Ember.computed('user', 'criterion.handle', function() {

  }),

  hoverMessage: Ember.computed('enrollmentStatus', 'user', function() {
    let name = this.get('user.name');
    let { title, enrollmentStatus, lastCompletedDate, lastCompletedExpirationDate, lastExpirationDate } = this.get('courseStatus').getProperties('title', 'enrollmentStatus', 'lastCompletedDate', 'lastCompletedExpirationDate', 'lastExpirationDate');

    switch(enrollmentStatus) {
      case ENROLLMENT_STATUSES.NOT_ENROLLED:
      return `${name} is not enrolled in ${title} Training.`;
      case ENROLLMENT_STATUSES.COMPLETE:
      return `${name} last completed ${title} Training on ${lastCompletedDate}. This will expire on ${lastCompletedExpirationDate}`;
      case ENROLLMENT_STATUSES.EXPIRED:
      return `${name} completed ${title} Training, but their training expired on ${lastExpirationDate}. ${name} should retake ${title} Training immediately.`;
      case ENROLLMENT_STATUSES.OVERDUE:
      return `${name} is assigned ${title} Training, but never completed it. ${title} Training is due immediately.`;
    }

  })
});
