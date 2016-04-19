import Ember from 'ember';

export default Ember.Route.extend({
  stepName: 'security-controls',

  model(params) {
    let securityControlGroups = this.modelFor('settings.security-controls');
    return securityControlGroups.findBy('handle', params.handle);
  },

  save() {
    Ember.run(() => window.scrollTo(0, 0));

    let { schemaDocument, attestation } = this.currentModel;
    let documentClone = Ember.$.extend(true, {}, schemaDocument.dump({ excludeInvalid: true }));

    attestation.set('document', documentClone);
    attestation.setUser(this.session.get('currentUser'));
    return attestation.save();
  },

  setupController(controller, model) {
    let securityControlGroups = this.modelFor('settings.security-controls');

    controller.set('model', model);
    controller.set('securityControlGroups', securityControlGroups);
  },

  actions: {
    onSave() {
      this.save();
    }
  }
});
