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



export default Ember.Mixin.create({
  criterionDocuments: null,

  isAppSecurity: Ember.computed.equal('criterion.handle', 'app_security_interview'),
  isBasicTraining: Ember.computed.equal('criterion.handle', 'training_log'),

  isRed: Ember.computed('showDefaultStatus', 'criterionDocuments.[]', 'activeApps.[]', 'productionApps.[]', 'users.[]', function() {
    if(this.get('isAppSecurity')) {
      let activeCount = this.get('activeApps.length');
      let expiredCount = this.get('expiredApps.length');
      let totalCount = this.get('productionApps.length');

      return (activeCount + expiredCount) < totalCount;
    }

    if(this.get('isBasicTraining')) {
      let activeUsersCount = this.get('activeUsers.length');
      let expiredUsersCount = this.get('expiredUsers.lenght');
      let totalUsers = this.get('users.length');

      return (activeUsersCount + expiredUsersCount) < totalUsers;
    }

    return this.get('hasNoDocuments');
  }),

  isYellow: Ember.computed('criterionDocuments.[]', 'activeApps.[]', 'productionApps.[]', 'users.[]', function() {
    if(this.get('isAppSecurity')) {

    }
  }),

  isGreen: Ember.computed('criterionDocuments.[]', 'activeApps.[]', 'productionApps.[]', 'users.[]', function() {

  }),

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

    }

    if(this.get('isRed')) {
      return 'incomplete';
    }

    if(this.get('isYellow')) {
      return 'expired';
    }

    return 'complete';
  }),

  defaultStatusText: Ember.computed('isRed', 'isGreen', 'isYellow', function() {
    let lastCompletedExpirationDate = this.get('lastCompletedExpirationDate');
    let lastCompletedDate = this.get('lastCompletedDate');
    let lastExpirationDate = this.get('lastExpirationDate');

    return {
      incomplete: 'Never completed.',
      expired: ``,
      complete: ``
    }[this.get('status')];
  }),

  // Application Security Mixins
  appStatuses: Ember.computed('isAppSecurity', 'criterionDocuments.@each.appUrl', 'productionApps.[]', function() {
    // This method maps over all apps and determines their compliance status
    // only a string is returned for each app.
    let documents = this.get('criterionDocuments');
    debugger;
    return this.get('productionApps').map((app) => {
      let appDocuments = documents.filterBy('appUrl', app.get('data.links.self'));
      let activeDocuments = appDocuments.filterBy('isExpired', false);
      let expiredDocuments = appDocuments.filterBy('isExpired', true);

      // Set the app directly on a document.  This is a cheat
      appDocuments.forEach((doc) => {
        doc.set('app', app)
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

  expiredApps: Ember.computed.filterBy('appStatuses', 'status', 'expired'),
  activeApps: Ember.computed.filterBy('appStatuses', 'status', 'complete'),
  incompleteApps: Ember.computed.filterBy('appStatuses', 'status', 'incomplete'),
  notIncompleteApps: Ember.computed('appStatuses.@each.status', function() {
    return this.get('appStatuses').filter((appStatus) => {
      return ['expired', 'complete'].indexOf(appStatus.get('status')) > -1;
    });
  }),

  appSecurityStatusText: Ember.computed('isAppSecurity', 'productionAppCount', 'activeAppsCount', function() {
    let appStatuses = this.get('appStatuses');
    let productionAppCount = this.get('productionApps.length')
    let expiredCount = this.get('expiredApps.length');
    let activeCount = this.get('activeApps.length');
    let incompleteCount = this.get('incompleteApps.length');
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
      return `Completed for none of ${productionAppCount} apps.`
    }

    // some apps have documents, some do not
    if(notIncompleteCount < productionAppCount && expiredCount > 0) {
      return `Completed for ${activeCount} of ${productionAppCount} apps, however ${expiredCount} have expired.`;
    }

    return `Completed for ${activeCount} of ${productionAppCount} apps.`;
  }),

  basicTrainingStatusText: Ember.computed('isBasicTraining', 'userCount', 'activeUserCount', function() {
    let userStatuses = this.get('userStatuses');
    let userCount = this.get('users.length');
    let expiredUsersCount = this.get('expiredUsers.length');
    let activeUsersCount = this.get('activeUsers.length');
    let incompleteUsersCount = this.get('incompleteUsers.length');
    let notIncompleteUsersCount = this.get('notIncompleteUsers.length');

    // All users have completed basic training
    if(activeUsersCount === userCount) {
      return `All users have completed basic training.`
    }

    // All users have completed training, but one or more is expired

  })
});
