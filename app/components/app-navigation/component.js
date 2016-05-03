import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Component.extend({
  tagName: 'ul',
  classNames: ['nav', 'nav-pills'],
  routingService: Ember.inject.service('routing'),

  showSheriff: Ember.computed(function() {
    return config.featureFlags['sheriff'];
  }),

  sheriffActive: Ember.computed('routingService.currentPath', function() {
    let currentPath = this.get('routingService.currentPath');
    return /^compliance\.compliance-organization/.test(currentPath);
  }),

  opsActive: Ember.computed.not('sheriffActive')
});