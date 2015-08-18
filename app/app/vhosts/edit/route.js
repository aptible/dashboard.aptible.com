import Ember from 'ember';

export default Ember.Route.extend({
  title() {
    let app = this.modelFor('app');

    return `Edit ${this.currentModel.vhost.get('virtualDomain')} - ${app.get('handle')}`;
  },

  model(params) {
    let app = this.modelFor('app');
    let stack = app.get('stack');

    return Ember.RSVP.hash({
      vhost: this.store.find('vhost', params.vhost_id),
      certificates: stack.get('certificates'),
      stack: stack
    });
  },

  afterModel(model) {
    let vhost = model.vhost;

    return Ember.RSVP.hash({
      service: vhost.get('service'),
      certificate: vhost.get('certificate')
    });
  },

  setupController(controller, model) {
    let vhost = model.vhost;
    let certificates = model.certificates;

    controller.set('model', vhost);
    controller.set('certificates', model.certificates);
    controller.set('vhostCertificate', certificates.objectAt(0));
    controller.set('showAddNewCertificate', model.certificates.get('length') === 0);
  },

  actions: {
    save() {
      let controller = this.controller;
      let app = this.modelFor('app');
      let vhost = this.currentModel.vhost;
      let certificatePromise;

      // If certificate create UI is visible, create a certificate
      // If not, use the selected certificate
      if(controller.get('showAddNewCertificate')) {
        let stack = this.currentModel.stack;
        let body = controller.get('certificateBody');
        let privateKey = controller.get('privateKey');
        let certParams = { body, stack, privateKey };
        let newCertificate = this.store.createRecord('certificate', certParams);

        certificatePromise = newCertificate.save();
      } else {
        certificatePromise = new Ember.RSVP.resolve(vhost.get('certificate'));
      }

      certificatePromise.then((certificate) => {
        vhost.setProperties({ app, certificate });
        vhost.set('certificateBody', '');
        vhost.set('privateKey', '');
        return vhost.save();
      }).then(() => {
        let op = this.store.createRecord('operation', {
          type: 'provision',
          vhost
        });
        return op.save();
      }).then( () => {
        let message = `Domain ${vhost.get('virtualDomain')} updated.`;
        this.transitionTo('app.vhosts.index');
        Ember.get(this, 'flashMessages').success(message);

      }).catch( (e) => {
        let message = Ember.get(e, 'responseJSON.message') || `There was an error updating ${vhost.get('virtualDomain')}`;
        Ember.get(this, 'flashMessages').danger(message);
      });
    },

    showAddNewCertificate(show) {
      this.controller.set('showAddNewCertificate', show);

      if(!show) {
        this.controller.set('newCertificate', '');
        this.controller.set('newPrivateKey', '');
      }
    },

    cancel() {
      this.transitionTo('app.vhosts.index');
    },

    willTransition() {
      this.currentModel.rollback();
    }
  }
});
