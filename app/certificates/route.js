import Ember from 'ember';

export default Ember.Route.extend({
  title() {
    let stack = this.modelFor('stack');
    return `${stack.get('handle')} Certificates`;
  },

  model() {
    let stack = this.modelFor('stack');
    return stack.get('certificates');
  },

  setupController(controller, model) {
    let stack = this.modelFor('stack');
    controller.setProperties({ model, stack });
  },

  actions: {
    openCreateCertificateModal() {
      let stack = this.modelFor('stack');
      this.controller.set('newCertificate', this.store.createRecord('certificate', { stack }));
    },

    onCreateCertificate(certificate) {
      let stack = this.modelFor('stack');

      certificate.save({ stack: {id: stack.get('id') } }).then(() => {
        let message = `${certificate.get('commonName')} created.`;
        this.transitionTo('certificates.index');
        Ember.get(this, 'flashMessages').success(message);
      });
    },

    delete(model) {
      // Confirm...
      let confirmMsg = `\nAre you sure you want to delete ${model.get('commonName')}?\n`;
      if (!confirm(confirmMsg)) { return false; }

      let stack = model.get('stack');

      model.deleteRecord();
      model.save().then(() => {
        let message = `${model.get('commonName')} certificate destroyed`;

        this.transitionTo('certificates', stack);
        Ember.get(this, 'flashMessages').success(message);
      });
    }
  }
});
