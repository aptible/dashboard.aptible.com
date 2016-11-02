import Ember from "ember";

export default Ember.Route.extend({
  model() {
    var app = this.modelFor('app');
    return app.get('vhosts');
  },

  actions: {
    openUpgradeVhostModal(vhost) {
      this.controller.set("vhostToUpgrade", vhost);
    },

    upgradeVhost(vhost) {
      vhost.setProperties({ platform: 'alb' });

      vhost.save().then(() => {
        let message = `Endpoint ${vhost.get('displayHost')} is being upgraded to ALB.`;
        Ember.get(this, 'flashMessages').info(message);
      }).then(() => {
        const op = this.store.createRecord('operation', { type: 'provision', vhost });
        return op.save();
      }).then((op) => {
        return op.reloadUntilStatusChanged(1000 * 60 * 10 /* minutes */);
      }).then(() => {
        let message = `Endpoint ${vhost.get('displayHost')} was upgraded to ALB.`;
        Ember.get(this, 'flashMessages').success(message);
      }).catch(() => {
        const message = `Failed to upgrade Endpoint ${vhost.get('displayHost')} to ALB.
                         Use aptible restart to access debugging information.`;
        Ember.get(this, 'flashMessages').danger(message);
      }).finally(() => {
        vhost.reload();
      });
    }
  }
});
