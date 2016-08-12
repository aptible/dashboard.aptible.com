import Ember from 'ember';
import DocumentStatusMixin from 'diesel/mixins/services/document-status';
import { COMPLIANCE_STATUSES } from 'diesel/mixins/services/document-status';

export default Ember.Mixin.create({
  documents: null,
  productionApps: Ember.computed.alias('complianceStatus.productionApps'),
  isAppSecurity: Ember.computed.equal('criterion.handle', 'app_security_interview'),
  isBasicTraining: Ember.computed.equal('criterion.handle', 'training_log'),
  isSecurityTraining: Ember.computed.equal('criterion.handle', 'security_officer_training_log'),
  isDeveloperTraining: Ember.computed.equal('criterion.handle', 'developer_training_log'),
  isRiskAssessment: Ember.computed.equal('criterion.handle', 'risk_assessment'),
  isPolicyManual: Ember.computed.equal('criterion.handle', 'policy_manua'),
  isRed: Ember.computed.equal('status', COMPLIANCE_STATUSES.INCOMPLETE),
  isYellow: Ember.computed.equal('status', COMPLIANCE_STATUSES.NEEDS_ATTENTION),
  isGreen: Ember.computed.equal('status', COMPLIANCE_STATUSES.ACTIVE),

  status: Ember.computed('hasActiveDocuments', 'hasNoDocuments', function() {
    if(this.get('hasActiveDocuments')) {
      return COMPLIANCE_STATUSES.ACTIVE;
    }

    if(this.get('hasNoDocuments')) {
      return COMPLIANCE_STATUSES.INCOMPLETE;
    }

    return COMPLIANCE_STATUSES.NEEDS_ATTENTION;
  }),

  statusText: Ember.computed('isRed', 'isYellow', 'isGreen', function() {
    if(this.get('isYellow')) {
      return `Complete, but expired on ${this.get('lastExpirationDate')}`;
    }

    if(this.get('isGreen')) {
      return `Last completed on ${this.get('lastCompletedDate')}. Expires on ${this.get('lastCompletedExpirationDate')}`;
    }

    return 'Never completed.';
  })
}, DocumentStatusMixin);
