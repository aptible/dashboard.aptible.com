import Ember from 'ember';

export default Ember.Controller.extend({
  showSPDNotice: Ember.computed.or('hasNoRiskAssessments', 'hasNotCompletedSetup'),

  hasNotCompletedSetup: Ember.computed.equal('model.hasCompletedSetup', false),
  persistedRiskAssessments: Ember.computed.filterBy('model.riskAssessments', 'isNew', false),

  hasNoRiskAssessments: Ember.computed.equal('persistedRiskAssessments.length', 0),
  draftRiskAssessments: Ember.computed.filterBy('persistedRiskAssessments', 'status', 'draft'),
  archivedRiskAssessments: Ember.computed.filterBy('persistedRiskAssessments', 'status', 'archived'),
  currentRiskAssessments: Ember.computed.filterBy('persistedRiskAssessments', 'status', 'current')
});
