import Ember from 'ember';

export const HOURS_PER_MONTH = 730;

export default Ember.Component.extend({
  tagName: 'tr',

  hasDisk: Ember.computed.notEmpty('database.disk'),

  total: Ember.computed('database.disk.size', 'hourlyRate', function () {
    return this.get('database.disk.size') * this.get('hourlyRate') * HOURS_PER_MONTH;
  })
});
