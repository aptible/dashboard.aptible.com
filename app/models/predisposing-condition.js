import DS from 'ember-data';
import Ember from 'ember';

export const PERVASIVENESSES = ['Few', 'Some', 'Many', 'Most', 'All'];

export default DS.Model.extend({
  riskAssessment: DS.belongsTo('riskAssessment'),
  handle: DS.attr('string'),
  title: DS.attr('string'),
  description: DS.attr('string'),
  pervasiveness: DS.attr('number'),

  threatEvents: DS.hasMany('threat-event', { embedded: true }),

  scaledPervasiveness: Ember.computed('pervasiveness', function() {
    // FIXME: This convertes the 10 point pervasiveness scale into a 5 point scale
    // Should probably just update the baseline risk graph rather than doing this
    let pervasiveness = this.get('pervasiveness');

    if([9,10].indexOf(pervasiveness) > -1) { return 4; }
    if([6,7,8].indexOf(pervasiveness) > -1) { return 3; }
    if([3,4,5].indexOf(pervasiveness) > -1) { return 2; }
    if([1,2].indexOf(pervasiveness) > -1) { return 1; }

    return 0;
  }),
  pervasivenessText: Ember.computed('scaledPervasiveness', function() {
    return `${PERVASIVENESSES[this.get('scaledPervasiveness') || 0]} Systems`;
  })
});
