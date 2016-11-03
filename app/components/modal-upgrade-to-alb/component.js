import Ember from 'ember';

export default Ember.Component.extend({
  vhostToUpgrade: null,

  title: "Upgrade to ALB",

  description: Ember.computed('vhostToUpgrade.displayHost', function() {
    return this.get("vhostToUpgrade.displayHost");
  }),

  actions: {
    upgradeVhost() {
      this.sendAction('upgradeVhost', this.get("vhostToUpgrade"));

      if (!this.isDestroyed) {
        this.sendAction('dismiss');
      }
    },

    onDismiss() {
      this.sendAction('dismiss');
    },

    outsideClick: Ember.K
  }
});
