import DS from 'ember-data';

export default DS.Model.extend({
  riskAssessment: DS.belongsTo('risk-assessment'),
  handle: DS.attr('string'),
  title: DS.attr('string'),
  description: DS.attr('string'),
  capability: DS.attr('number'),
  intent: DS.attr('number'),
  targeting: DS.attr('number'),
  rangeOfEffects: DS.attr('number'),
  threatVector: DS.attr('number'),
  adversarial: DS.attr('boolean'),

  threatEvents: DS.hasMany('threat-event', { embedded: true })
});
