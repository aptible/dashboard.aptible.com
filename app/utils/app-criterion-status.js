import Ember from 'ember';
import CriterionStatusMixin from 'diesel/mixins/services/criterion-status';
import DocumentStatusMixin from 'diesel/mixins/services/document-status';
import { COMPLIANCE_STATUSES } from 'diesel/mixins/services/document-status';

let AppCriterionStatus = Ember.Object.extend(DocumentStatusMixin, {});

export default Ember.Object.extend(CriterionStatusMixin, {
  showDefaultStatus: false,
  status: Ember.computed('documents.[]', 'productionApps.[]', function() {
    let activeCount = this.get('activeApps.length');
    let expiredCount = this.get('expiredApps.length');
    let totalCount = this.get('productionApps.length');

    return this.getStatusByCounts(activeCount, expiredCount, totalCount);
  }),

  expiredApps: Ember.computed.filterBy('appStatuses', 'status', 'expired'),
  activeApps: Ember.computed.filterBy('appStatuses', 'status', 'complete'),
  incompleteApps: Ember.computed.filterBy('appStatuses', 'status', 'incomplete'),
  notIncompleteApps: Ember.computed('appStatuses.@each.status', function() {
    let completeStatuses = [COMPLIANCE_STATUSES.NEEDS_ATTENTION, COMPLIANCE_STATUSES.ACTIVE];
    return this.get('appStatuses').filter((appStatus) => {
      return completeStatuses.indexOf(appStatus.get('status')) > -1;
    });
  }),

  appStatuses: Ember.computed('documents.@each.appUrl', 'productionApps.[]', function() {
    // This method maps over all apps and determines their compliance status
    // only a string is returned for each app.
    let documents = this.get('documents');

    return this.get('productionApps').map((app) => {
      let appDocuments = documents.filterBy('appUrl', app.get('data.links.self'));
      let activeDocuments = appDocuments.filterBy('isExpired', false);
      let expiredDocuments = appDocuments.filterBy('isExpired', true);

      // Set the app directly on a document.  This is a cheat
      appDocuments.forEach((doc) => {
        doc.set('app', app);
      });

      let status = COMPLIANCE_STATUSES.INCOMPLETE;

      if(activeDocuments.length > 0) {
        status = COMPLIANCE_STATUSES.ACTIVE;
      } else if(expiredDocuments.length > 0) {
        status = COMPLIANCE_STATUSES.NEEDS_ATTENTION;
      }

      return AppCriterionStatus.create({ app, status, documents, criterion: this.get('criterion') });
    });
  }),

  statusText: Ember.computed('productionAppCount', 'activeAppsCount', function() {
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
  })


});