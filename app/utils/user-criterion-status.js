import Ember from 'ember';
import CriterionStatusMixin from 'diesel/mixins/services/criterion-status';
import DocumentStatusMixin from 'diesel/mixins/services/document-status';
import { COMPLIANCE_STATUSES } from 'diesel/mixins/services/document-status';

export const COURSE_NAMES = { training_log: 'Basic',
                              developer_training_log: 'Developer',
                              security_officer_training_log: 'Security' };

let UserCriterionStatus = Ember.Object.extend(DocumentStatusMixin, {
  title: Ember.computed('criterion.handle', function() {
    return COURSE_NAMES[this.get('criterion.handle')];
  }),

  statusText: Ember.computed('status', 'user', function() {
    let name = this.get('user.name');
    let { title, lastCompletedDate, lastCompletedExpirationDate, lastExpirationDate } = this.getProperties('title', 'lastCompletedDate', 'lastCompletedExpirationDate', 'lastExpirationDate');

    switch(status) {
      case COMPLIANCE_STATUSES.NOT_REQUIRED:
      return `${name} is not enrolled in ${title} Training.`;
      case COMPLIANCE_STATUSES.ACTIVE:
      return `${name} last completed ${title} Training on ${lastCompletedDate}. This will expire on ${lastCompletedExpirationDate}`;
      case COMPLIANCE_STATUSES.NEEDS_ATTENTION:
      return `${name} completed ${title} Training, but their training expired on ${lastExpirationDate}. ${name} should retake ${title} Training immediately.`;
      case COMPLIANCE_STATUSES.INCOMPLETE:
      return `${name} is assigned ${title} Training, but never completed it. ${title} Training is due immediately.`;
    }

  })
});

export default Ember.Object.extend(CriterionStatusMixin, {
  showDefaultStatus: false,
  status: Ember.computed('documents.[]', 'users.[]', function() {
    let activeCount = this.get('activeUsers.length');
    let expiredCount = this.get('expiredUsers.length');
    let totalCount = this.get('users.length');

    return this.getStatusByCounts(activeCount, expiredCount, totalCount);
  }),

  users: Ember.computed.alias('complianceStatus.users'),
  expiredUsers: Ember.computed.filterBy('userStatuses', 'status', 'expired'),
  activeUsers: Ember.computed.filterBy('userStatuses', 'status', 'complete'),
  incompleteUsers: Ember.computed.filterBy('userStatuses', 'status', 'incomplete'),
  notIncompleteUsers: Ember.computed('userStatuses.@each.status', function() {
    return this.get('userStatuses').filter((appStatus) => {
      return ['expired', 'complete'].indexOf(appStatus.get('status')) > -1;
    });
  }),

  userStatuses: Ember.computed('documents.@each.userUrl', 'users.[]', function() {
    // UserStatus maps over all users and creates a new `UserCriterionStatus`
    // object that stores the state of their compliance
    let documents = this.get('documents');

    return this.get('users').map((user) => {
      let userDocuments = documents.filterBy('userUrl', user.get('data.links.self'));
      let activeDocuments = userDocuments.filterBy('isExpired', false);
      let expiredDocuments = userDocuments.filterBy('isExpired', true);

      // Set the user directly on a document.  This is a cheat
      userDocuments.forEach((doc) => {
        doc.set('user', user);
      });

      let status = 'incomplete';

      if(activeDocuments.length > 0) {
        status = 'complete';
      } else if(expiredDocuments.length > 0) {
        status = 'expired';
      }

      return UserCriterionStatus.create({ user, status, documents: userDocuments, criterion: this.get('criterion') });
    });
  }),

  statusText: Ember.computed('isBasicTraining', 'users.[]', 'activeUsers.[]', function() {
    let userCount = this.get('users.length');
    let expiredUsersCount = this.get('expiredUsers.length');
    let activeUsersCount = this.get('activeUsers.length');
    let notIncompleteUsersCount = this.get('notIncompleteUsers.length');

    // All users have completed basic training
    if(activeUsersCount === userCount) {
      return `All users have completed basic training.`;
    }

    // All have documents, but one or more is expired
    if(notIncompleteUsersCount === userCount) {
      return `All users have completed training, however ${expiredUsersCount} have expired`;
    }

    // No users have documents
    if(notIncompleteUsersCount === 0) {
      return `None of your ${userCount} users have completed Basic Training`;
    }

    // some users have documents, some do not
    if(notIncompleteUsersCount < userCount && expiredUsersCount > 0) {
      return `${notIncompleteUsersCount} users have completed basic training, however ${expiredUsersCount} have expired.`;
    }

    return `${activeUsersCount} of ${userCount} have completed basic training.`;

  })
});