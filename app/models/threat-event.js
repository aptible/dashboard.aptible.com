import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  riskAssessment: DS.belongsTo('riskAssessment'),
  handle: DS.attr('string'),
  title: DS.attr('string'),
  description: DS.attr('string'),
  relevance: DS.attr('number'),
  baseImpact: DS.attr('number'),
  likelihoodOfOccurence: DS.attr('number'),
  adversarial: DS.attr('boolean'),
  vulnerabilities: DS.hasMany('vulnerability', { async: false }),
  threatSources: DS.hasMany('threatSource', { async: false }),
  predisposingConditions: DS.hasMany('predisposingCondition', { async: false })
});
