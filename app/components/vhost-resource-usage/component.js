import Ember from 'ember';

export const HOURS_PER_MONTH = 730;

export default Ember.Component.extend({
  tagName: 'tr',
  isProvisioned: Ember.computed.equal('status', 'provisioned'),

  total: Ember.computed('hourlyRate', function () {
    return this.get('hourlyRate') * HOURS_PER_MONTH;
  })
});
