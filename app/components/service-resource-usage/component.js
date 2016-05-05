import Ember from 'ember';

export const HOURS_PER_MONTH = 730;

export default Ember.Component.extend({
  tagName: 'tr',

  hasContainers: Ember.computed.gt('release.containers.length', 0),

  total: Ember.computed('service.usage', 'hourlyRate', function () {
    return this.get('service.usage') * this.get('hourlyRate') * HOURS_PER_MONTH;
  })
});
