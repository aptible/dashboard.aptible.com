import Ember from 'ember';

export default Ember.Route.extend({
  titleToken() {
    var app = this.modelFor('app');
    return `Add an endpoint - ${app.get('handle')}`;
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

    vhost.set('isDefault', false);

    controller.set('model', vhost);
    controller.set('services', services);
    controller.set('certificates', certificates);
    controller.set('vhostService', services.objectAt(0));
  },

  actions: {
    save(vhost, service) {
      let certificatePromise;
      let stack = this.currentModel.stack;

      let promise;

      if(vhost.get('isDefault')) {
        vhost.set('service', service);
        promise = vhost.save();
      } else {
        if(vhost.get('certificateBody')) {
          let certificateBody = vhost.get('certificateBody');
          let privateKey = vhost.get('privateKey');
          let newCertificate = this.store.createRecord(
            'certificate',
            { certificateBody, stack, privateKey }
          );

          certificatePromise = newCertificate.save();
        } else {
          certificatePromise = new Ember.RSVP.resolve(vhost.get('certificate'));
        }

        promise = certificatePromise.then((certificate) => {
          vhost.setProperties({ service, certificate, certificateBody: null,
            privateKey: null});

          return vhost.save();
        });
      }

      promise.then(() => {
        let op = this.store.createRecord('operation', {
          type: 'provision',
          vhost: vhost
        });

        return op.save();
      }).then(() => {
        let message = `Endpoint created: ${vhost.get('virtualDomain')}`;

        this.transitionTo('app.vhosts');
        Ember.get(this, 'flashMessages').success(message);
      }).catch( (e) => {
        let message = Ember.get(e, 'responseJSON.message') ||
                      Ember.get(e, 'message') ||
                      `There was an error updating endpoint ${vhost.get('virtualDomain')}`;
        Ember.get(this, 'flashMessages').danger(message);
      });
    },

    cancel() {
      this.transitionTo('app.vhosts');
    },

    willTransition() {
      this.currentModel.vhost.rollback();
    }
  }
});
