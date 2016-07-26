import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Component.extend({
  tagName: 'ul',
  classNames: ['nav', 'nav-pills'],
  routingService: Ember.inject.service('routing'),

  showSheriff: Ember.computed(function() {
    return config.featureFlags['sheriff'];
  }),

  hasCompliancePlan: Ember.computed('currentUser.organizations.@each.billingDetail', function() {
    return this.get('currentUser.organizations').reduce(function(prev, org) {
      return prev || org.get('billingDetail.allowPHI');
    }, false)
  }),

  hasAccessTo(product) {
    let currentUser = this.get('currentUser');
    if (!currentUser) { return false; }
    let currentUserRoles = currentUser.get('roles');
    return currentUserRoles.filterBy(product).length > 0;
  },

  hasAccessToPlatform: Ember.computed('currentUser.roles', function() {
    return this.hasAccessTo('isPlatform');
  }),

  hasAccessToCompliance: Ember.computed('currentUser.roles', function() {
    return this.hasAccessTo('isCompliance') && this.get('hasCompliancePlan');
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
