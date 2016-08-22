import DS from 'ember-data';

export default DS.Model.extend({
  riskAssessment: DS.belongsTo('risk-assessment'),
  efficacy: DS.attr('number'),
  vulnerability: DS.belongsTo('vulnerability', { embedded: true }),
  securityControl: DS.belongsTo('security-control', { embedded: true })
});
