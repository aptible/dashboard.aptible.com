import Ember from 'ember';

export const HOURS_PER_MONTH = 730;

export default Ember.Component.extend({
  tagName: 'tr',

  hasRelease: Ember.computed.notEmpty('vhost.service.currentRelease'),

  hasContainers: Ember.computed.notEmpty('vhost.service.currentRelease.containers'),

  hasReleaseAndContainers: Ember.computed.and('hasRelease', 'hasContainers'),

  total: Ember.computed('hourlyRate', function () {
    return this.get('hourlyRate') * HOURS_PER_MONTH;
  })
});
