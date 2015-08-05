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
      certificates: stack.get('certificates'),
      stack: stack
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
    controller.set('showAddNewCertificate', certificates.get('length') === 0);
  },

  actions: {
    showAddNewCertificate(show) {
      this.controller.set('showAddNewCertificate', show);
    },

    willTransition() {
      this.currentModel.rollback();
    },

    save(vhost, service, certificate) {
      let certificatePromise;

      if(!certificate) {
        let newCertificate = this.store.createRecord('certificate',
          { body: vhost.get('certificateBody'),
            stack: this.currentModel.stack,
            privateKey: vhost.get('privateKey') });

        certificatePromise = newCertificate.save();
      } else {
        certificatePromise = new Ember.RSVP.resolve(certificate);
      }

      certificatePromise.then((certificate) => {
        vhost.set('service', service);
        vhost.set('certificate', certificate);

        // TODO: The following fields are deprecated and will soon be removed
        vhost.set('certificateBody', '');
        vhost.set('privateKey', '');

        return vhost.save();
      }).then( () => {
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