import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  riskAssessment: DS.belongsTo('riskAssessment'),
  efficacy: DS.attr('number'),
  vulnerability: DS.belongsTo('vulnerability', { embedded: true }),
  securityControl: DS.belongsTo('securityControl', { embedded: true })
});
