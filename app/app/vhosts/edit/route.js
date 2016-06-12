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

    controller.set('model', vhost);
    controller.set('certificates', model.certificates);
    controller.set('originalCertificate', vhost.get('certificate'));
  },

  actions: {
    save() {
      let vhost = this.currentModel.vhost;
      let stack = this.currentModel.stack;
      let certificatePromise;

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

      certificatePromise.then((certificate) => {
        vhost.setProperties({ certificate, certificateBody: null, privateKey: null });
        return vhost.save();
      }).then(() => {
        let op = this.store.createRecord('operation', {
          type: 'provision',
          vhost
        });

        return op.save();
      }).then( () => {
        let message = `Endpoint ${vhost.get('virtualDomain')} updated.`;
        Ember.get(this, 'flashMessages').success(message);

        return vhost.reload();
      }).then( () => {
        this.transitionTo('app.vhosts.index');
      }).catch( (e) => {
        let message = Ember.get(e, 'responseJSON.message') ||
                      Ember.get(e, 'message') ||
                      `There was an error updating the ${vhost.get('virtualDomain')} endpoint`;
        Ember.get(this, 'flashMessages').danger(message);
      });
    },

    cancel() {
      this.currentModel.vhost.set(
        'certificate',
        this.controller.get('originalCertificate')
      );
      this.currentModel.vhost.rollback();
      this.transitionTo('app.vhosts.index');
    }
  }
});
