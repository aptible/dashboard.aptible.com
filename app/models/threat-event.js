import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  riskAssessment: DS.belongsTo('risk-assessment'),
  handle: DS.attr('string'),
  title: DS.attr('string'),
  description: DS.attr('string'),

  riskLevel: DS.attr('number'),
  relevance: DS.attr('number'),
  overallLikelihood: DS.attr('number'),
  impact: DS.attr('number'),
  likelihoodOfInitiation: DS.attr('number'),
  likelihoodOfAdverseImpacts: DS.attr('number'),
  exceedsAtackerCapacity: DS.attr('number'),
  maxAttackerCapability: DS.attr('number'),
  maxSeverity: DS.attr('number'),

  threatSources: DS.hasMany('threat-source', { embedded: true }),
  predisposingConditions: DS.hasMany('predisposing-condition', { embedded: true }),
  vulnerabilities: DS.hasMany('vulnerability', { embedded: true }),

  securityControls: Ember.computed('vulnerabilities.[]', function() {
    let securityControls = {};

    this.get('vulnerabilities').forEach((vulnerability) => {
      vulnerability.get('securityControls').forEach((sc) => {
        securityControls[sc.get('id')] = sc;
      });
    });

    return Ember.keys(securityControls).map((id) => securityControls[id]);
  }),

  briefDescription: Ember.computed('description', function() {
    let maxLength = 99;
    if(this.get('description.length') < maxLength) {
      return false;
    }

    return `${this.get('description').substr(0, maxLength - 1)}`;
  })
});
