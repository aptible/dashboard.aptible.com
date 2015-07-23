import Ember from 'ember';

export default Ember.Route.extend({
  titleToken() {
    var app = this.modelFor('app');
    return `Add a domain - ${app.get('handle')}`;
  },

  model() {
    var app = this.modelFor('app');
    var stack = app.get('stack');

    return Ember.RSVP.hash({
      vhost: this.store.createRecord('vhost', { app }),
      services: app.get('services'),
      certificates: stack.get('certificates')
    });
  },

  setupController(controller, model) {
    var vhost = model.vhost,
        services = model.services,
        certificates = model.certificates;

    controller.set('model', vhost);
    controller.set('services', services);
    controller.set('certificates', certificates);
    controller.set('vhostService', services.objectAt(0));
    controller.set('vhostCertificate', certificates.objectAt(0));
  },

  actions: {
    willTransition() {
      this.currentModel.rollback();
    },

    save(vhost, service, certificate) {
      vhost.set('service', service);
      vhost.set('certificate', certificate);

      vhost.save().then( () => {
        let op = this.store.createRecord('operation', {
          type: 'provision',
          vhost: vhost
        });
        return op.save();
      }).then( () => {
        let message = `Domain ${vhost.get('virtualDomain')} created`;

        this.transitionTo('app.vhosts');
        Ember.get(this, 'flashMessages').success(message);
      });
    },

    cancel() {
      this.transitionTo('app.vhosts');
    }
  }
});