import DS from 'ember-data';
import Ember from 'ember';

export const RELEVANCES = [
  'Not Applicable', 'Possible', 'Predicted', 'Expected'
];

export const IMPACTS = [
  'None', 'Limited', 'Serious', 'Severe', 'Catastrophic'
];

export default DS.Model.extend({
  riskAssessment: DS.belongsTo('riskAssessment'),
  handle: DS.attr('string'),
  title: DS.attr('string'),
  description: DS.attr('string'),
  appliedRiskIndex: DS.attr('number'),
  plannedRiskIndex: DS.attr('number'),
  relevance: DS.attr('number'),
  baseImpact: DS.attr('number'),
  likelihoodOfOccurence: DS.attr('number'),
  adversarial: DS.attr('boolean'),
  vulnerabilities: DS.hasMany('vulnerability', { async: false }),
  threatSources: DS.hasMany('threatSource', { async: false }),
  predisposingConditions: DS.hasMany('predisposingCondition', { async: false }),
  securityControls: Ember.computed('vulnerabilities.securityControls.[]', function() {
    let securityControls = {};

    this.get('vulnerabilities').forEach((vulnerability) => {
      vulnerability.get('securityControls').forEach((sc) => {
        securityControls[sc.get('id')] = sc;
      });
    });

    return Ember.keys(securityControls).map((id) => securityControls[id]);
  }),

  impact: Ember.computed('baseImpact', function() {
    // FIXME: This convertes the 10 point base impact scale into a 5 point scale
    // Should probably just update the baseline risk graph rather than doing this
    let baseImpact = this.get('baseImpact');

    if([9,10].indexOf(baseImpact) > -1) { return 4; }
    if([6,7,8].indexOf(baseImpact) > -1) { return 3; }
    if([3,4,5].indexOf(baseImpact) > -1) { return 2; }
    if([1,2].indexOf(baseImpact) > -1) { return 1; }

    return 0;
  }),

  impactText: Ember.computed('impact', function() {
    return IMPACTS[this.get('impact') || 0];
  }),

  relevanceText: Ember.computed('relevance', function() {
    return RELEVANCES[this.get('relevance') || 0];
  })
});
