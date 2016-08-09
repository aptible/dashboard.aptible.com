import Ember from 'ember';
import { formatUtcTimestamp } from 'diesel/helpers/format-utc-timestamp';

function formatDate(date) {
  return formatUtcTimestamp(date, true);
}

export const COMPLIANCE_STATUSES = {
  ACTIVE: 'complete',
  NEEDS_ATTENTION: 'expired',
  INCOMPLETE: 'incomplete'
};

export const RECENT_ACTIVITY_COUNT = 3;

export default Ember.Mixin.create({
  criterionDocuments: null,
  recentActivityDocuments: Ember.computed('criterionDocuments.[]', function() {
    return this.get('criterionDocuments').slice(0, RECENT_ACTIVITY_COUNT);
  }),

  isAppSecurity: Ember.computed.equal('criterion.handle', 'app_security_interview'),
  isBasicTraining: Ember.computed.equal('criterion.handle', 'training_log'),

  isRed: Ember.computed.equal('status', 'incomplete'),
  isYellow: Ember.computed.equal('status', 'expired'),
  isGreen: Ember.computed.equal('status', 'complete'),

  hasNoDocuments: Ember.computed.equal('criterionDocuments.length', 0),
  hasNoActiveDocuments: Ember.computed.equal('activeCriterionDocuments.length', 0),
  hasActiveDocuments: Ember.computed.gt('activeCriterionDocuments.length', 0),
  hasExpiredDocuments: Ember.computed.gt('expiredCriterionDocuments.length', 0),

  activeCriterionDocuments: Ember.computed.filterBy('criterionDocuments', 'isExpired', false),
  expiredCriterionDocuments: Ember.computed.filterBy('criterionDocuments', 'isExpired', true),

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

  showDefaultStatus: Ember.computed('isAppSecurity', 'isBasicTraining', function() {
    return !this.get('isAppSecurity') && !this.get('isBasicTraining');
  }),

  getAppSecurityStatus() {
    let activeCount = this.get('activeApps.length');
    let expiredCount = this.get('expiredApps.length');
    let totalCount = this.get('productionApps.length');

    return this.getStatusByCounts(activeCount, expiredCount, totalCount);
  },

  getBasicTrainingStatus() {
    let activeCount = this.get('activeUsers.length');
    let expiredCount = this.get('expiredUsers.length');
    let totalCount = this.get('users.length');

    return this.getStatusByCounts(activeCount, expiredCount, totalCount);
  },

  getStatusByCounts(activeCount, expiredCount, totalCount) {
    if(activeCount === totalCount) {
      return COMPLIANCE_STATUSES.ACTIVE;
    }

    if((activeCount + expiredCount) === totalCount) {
      return COMPLIANCE_STATUSES.NEEDS_ATTENTION;
    }

    return COMPLIANCE_STATUSES.INCOMPLETE;
  },

  status: Ember.computed('criterionDocuments.[]', 'activeApps.[]', 'productionApps.[]', 'users.[]', function() {
    if(this.get('isAppSecurity')) {
      return this.getAppSecurityStatus();
    }

    if(this.get('isBasicTraining')) {
      return this.getBasicTrainingStatus();
    }

    if(this.get('hasActiveDocuments')) {
      return COMPLIANCE_STATUSES.ACTIVE;
    }

    if(this.get('hasNoDocuments')) {
      return COMPLIANCE_STATUSES.INCOMPLETE;
    }

    return COMPLIANCE_STATUSES.NEEDS_ATTENTION;
  }),


  appStatuses: Ember.computed('isAppSecurity', 'criterionDocuments.@each.appUrl', 'productionApps.[]', function() {
    // This method maps over all apps and determines their compliance status
    // only a string is returned for each app.
    let documents = this.get('criterionDocuments');

    return this.get('productionApps').map((app) => {
      let appDocuments = documents.filterBy('appUrl', app.get('data.links.self'));
      let activeDocuments = appDocuments.filterBy('isExpired', false);
      let expiredDocuments = appDocuments.filterBy('isExpired', true);

      // Set the app directly on a document.  This is a cheat
      appDocuments.forEach((doc) => {
        doc.set('app', app);
      });

      let status = 'incomplete';

      if(activeDocuments.length > 0) {
        status = 'complete';
      } else if(expiredDocuments.length > 0) {
        status = 'expired';
      }

      return Ember.Object.create({ app, status });
    });
  }),

  userStatuses: Ember.computed('isBasictraining', 'criterionDocuments.@each.userUrl', 'users.[]', function() {
    // This method maps over all users and determines their compliance status
    // only a string is returned for each app.
    let documents = this.get('criterionDocuments');

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

      return Ember.Object.create({ user, status });
    });
  }),

  expiredApps: Ember.computed.filterBy('appStatuses', 'status', 'expired'),
  activeApps: Ember.computed.filterBy('appStatuses', 'status', 'complete'),
  incompleteApps: Ember.computed.filterBy('appStatuses', 'status', 'incomplete'),
  notIncompleteApps: Ember.computed('appStatuses.@each.status', function() {
    return this.get('appStatuses').filter((appStatus) => {
      return ['expired', 'complete'].indexOf(appStatus.get('status')) > -1;
    });
  }),

  expiredUsers: Ember.computed.filterBy('userStatuses', 'status', 'expired'),
  activeUsers: Ember.computed.filterBy('userStatuses', 'status', 'complete'),
  incompleteUsers: Ember.computed.filterBy('userStatuses', 'status', 'incomplete'),
  notIncompleteUsers: Ember.computed('userStatuses.@each.status', function() {
    return this.get('userStatuses').filter((appStatus) => {
      return ['expired', 'complete'].indexOf(appStatus.get('status')) > -1;
    });
  }),

  appSecurityStatusText: Ember.computed('isAppSecurity', 'productionAppCount', 'activeAppsCount', function() {
    let productionAppCount = this.get('productionApps.length');
    let expiredCount = this.get('expiredApps.length');
    let activeCount = this.get('activeApps.length');
    let notIncompleteCount = this.get('notIncompleteApps.length');

    // all apps have documents and non are expired
    if(activeCount === productionAppCount) {
      return `Completed for all apps.`;
    }

    // All have documents, but one or more is expired
    if(notIncompleteCount === productionAppCount) {
      return `Completed for all ${productionAppCount} apps, however ${expiredCount} have expired.`;
    }

    // No apps have documents
    if(notIncompleteCount === 0) {
      return `Completed for none of ${productionAppCount} apps.`;
    }

    // some apps have documents, some do not
    if(notIncompleteCount < productionAppCount && expiredCount > 0) {
      return `Completed for ${notIncompleteCount} of ${productionAppCount} apps, however ${expiredCount} have expired.`;
    }

    return `Completed for ${activeCount} of ${productionAppCount} apps.`;
  }),

  basicTrainingStatusText: Ember.computed('isBasicTraining', 'users.[]', 'activeUsers.[]', function() {
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
