import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  riskAssessment: DS.belongsTo('riskAssessment'),
  handle: DS.attr('string'),
  title: DS.attr('string'),
  description: DS.attr('string'),
  capability: DS.attr('number'),
  intent: DS.attr('number'),
  targeting: DS.attr('number'),
  rangeOfEffects: DS.attr('number'),
  adversarial: DS.attr('boolean')
});
