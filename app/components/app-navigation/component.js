import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Component.extend({
  tagName: 'ul',
  classNames: ['nav', 'nav-pills'],
  routingService: Ember.inject.service('routing'),

  showSheriff: Ember.computed(function() {
    return config.featureFlags['sheriff'];
  }),

  hasAccessToPlatform: Ember.computed('currentUser.roles', function() {
    let currentUser = this.get('currentUser');
    if (!currentUser) { return false; }
    let currentUserRoles = currentUser.get('roles');
    return currentUserRoles.filterBy('isPlatform').length > 0;
  }),

  hasAccessToCompliance: Ember.computed('currentUser.roles', function() {
    let currentUser = this.get('currentUser');
    if (!currentUser) { return false; }
    let currentUserRoles = currentUser.get('roles');
    return currentUserRoles.filterBy('isCompliance').length > 0;
  }),

  sheriffActive: Ember.computed('routingService.currentPath', function() {
    let currentPath = this.get('routingService.currentPath');
    return /^compliance\.compliance-organization/.test(currentPath);
  }),

  opsActive: Ember.computed('routingService.currentPath', function() {
    return !this.get('sheriffActive') && !this.get('settingsActive');
  }),

  settingsActive: Ember.computed('routingService.currentPath', function() {
    let currentPath = this.get('routingService.currentPath');
    return /members|contact|billing|settings|roles|invite|environments/.test(currentPath);
  })
});
