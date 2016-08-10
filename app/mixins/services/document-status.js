import Ember from 'ember';
import { formatUtcTimestamp } from 'diesel/helpers/format-utc-timestamp';

export const COMPLIANCE_STATUSES = {
  NOT_REQUIRED: 'notRequired',
  ACTIVE: 'complete',
  NEEDS_ATTENTION: 'expired',
  INCOMPLETE: 'incomplete'
};

export const RECENT_ACTIVITY_COUNT = 3;

function formatDate(date) {
  return formatUtcTimestamp(date, true);
}

export default Ember.Mixin.create({
  hasNoDocuments: Ember.computed.equal('documents.length', 0),
  hasNoActiveDocuments: Ember.computed.equal('activeDocuments.length', 0),
  hasActiveDocuments: Ember.computed.gt('activeDocuments.length', 0),
  hasExpiredDocuments: Ember.computed.gt('expiredDocuments.length', 0),
  activeDocuments: Ember.computed.filterBy('documents', 'isExpired', false),
  expiredDocuments: Ember.computed.filterBy('documents', 'isExpired', true),

  recentActivityDocuments: Ember.computed('documents.[]', function() {
    if(!this.get('documents')) {
      return [];
    }

    return this.get('documents').slice(0, RECENT_ACTIVITY_COUNT);
  }),

  lastCompletedDate: Ember.computed('activeDocuments.[]', function() {
    let completedDate = this.get('activeDocuments.firstObject.createdAt');

    if (completedDate) {
      return formatDate(completedDate);
    }
  }),

  lastCompletedExpirationDate: Ember.computed('activeDocuments.[]', function() {
    let expiresDate = this.get('activeDocuments.firstObject.expiresAt');

    if (expiresDate) {
      return formatDate(expiresDate);
    }
  }),

  lastExpirationDate: Ember.computed('documents.[]', function() {
    let lastExpired = this.get('documents.firstObject.expiresAt');

    if(lastExpired) {
      return formatDate(lastExpired);
    }
  }),

  getStatusByCounts(activeCount, expiredCount, totalCount) {
    if(activeCount === totalCount) {
      return COMPLIANCE_STATUSES.ACTIVE;
    }

    if((activeCount + expiredCount) === totalCount) {
      return COMPLIANCE_STATUSES.NEEDS_ATTENTION;
    }

    return COMPLIANCE_STATUSES.INCOMPLETE;
  }
});