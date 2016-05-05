import Ember from 'ember';

export default Ember.Component.extend({
  //sortBy: ['handle:asc'],

  arrayChanged: function() {
    Ember.run.once(this, 'checkModelArray');
  }.observes('model.[]'),

  checkModelArray: function() {
    if(this.get('model').get('length') === 0) {
      this.sendAction('redirect');
    }
  },

  provisionedDomains: Ember.computed.filterBy('model', 'isProvisioned'),

  activeDomains: Ember.computed.filterBy('provisionedDomains', 'hasActionRequired', false),
  actionRequiredDomains: Ember.computed.filterBy('provisionedDomains', 'hasActionRequired'),
  pendingDomains: Ember.computed.filterBy('model', 'isProvisioning'),
  deprovisioningDomains: Ember.computed.filterBy('model', 'isDeprovisioning'),
  deprovisionedDomains: Ember.computed.filterBy('model', 'hasBeenDeprovisioned'),

  hasActive: Ember.computed.gt('activeDomains.length', 0),
  hasActionRequired: Ember.computed.gt('actionRequiredDomains.length', 0),
  failedProvisionDomains: Ember.computed.filterBy('model', 'hasFailedProvision'),
  failedDeprovisionDomains: Ember.computed.filterBy('model', 'hasFailedDeprovision'),
  hasPending: Ember.computed.gt('pendingDomains.length', 0),
  hasDeprovisioning: Ember.computed.gt('deprovisioningDomains.length', 0),
  hasDeprovisioned: Ember.computed.gt('deprovisionedDomains.length', 0),

  hasFailedProvision: Ember.computed.gt('failedProvisionDomains.length', 0),
  hasFailedDeprovision: Ember.computed.gt('failedDeprovisionDomains.length', 0),
  showSortableHeader: Ember.computed.or('hasPending', 'hasDeprovisioning', 'hasFailedDeprovision', 'hasFailedProvision'),

  actions: {
    redirect() {
      this.sendAction('forceRedirect');
    },
    startDeletion() {
      this.sendAction('startDeletion');
    },
    failDeletion() {
      this.sendAction('failDeletion');
    },
    completeDeletion() {
      this.sendAction('completeDeletion');
    }
  }
});
