import Ember from 'ember';

export default Ember.Component.extend({
  model: null,
  services: null,
  certificates: null,
  vhostService: null,
  hasDefaultVhost: false,

  setInitialVhostServiceState: function() {
    this.setHasDefaultVhost(this.get('vhostService'));
  }.on('didInsertElement'),

  vhostServiceObserver: function() {
    this.setHasDefaultVhost(this.get('vhostService'));
  }.observes('vhostService'),


  setHasDefaultVhost: function(vhostService) {
    if(vhostService) {
      vhostService.get('vhosts').then((vhosts) => {
        let filtered = vhosts.filter((vhost) => vhost.get('isDefault'));
        this.set('serviceHasDefaultVhost', filtered.length > 0);
      });
    }
  },

  actions: {
    save(vhost, service) {
      this.sendAction('save', vhost, service);
    },

    cancel() {
      this.sendAction('cancel');
    },

    willTransition() {
      this.sendAction('willTransition');
    }
  }
});
