import Ember from 'ember';
import SPDRouteMixin from 'diesel/mixins/routes/spd-route';

export default Ember.Route.extend(SPDRouteMixin, {
  stepName: 'security-controls',

  model(params) {
    let securityControlGroups = this.modelFor('gridiron-setup.security-controls');
    return securityControlGroups.findBy('handle', params.handle);
  },

  save() {
    Ember.run(() => window.scrollTo(0, 0));

    let { schemaDocument, attestation } = this.currentModel;
    let documentClone = Ember.$.extend(true, {}, schemaDocument.dump({ excludeInvalid: true }));

    attestation.set('document', documentClone);
    attestation.setUser(this.session.get('currentUser'));
    return attestation.save().then(() => {
      Ember.set(this.currentModel, 'completed', true);
      Ember.get(this, 'flashMessages').success('Security controls saved!');
    });
  },

  setupController(controller, model) {
    let securityControlGroups = this.modelFor('gridiron-setup.security-controls');

    controller.set('model', model);
    controller.set('securityControlGroups', securityControlGroups);
  },

  transitionToNextGroup() {
    let handle = this.currentModel.handle;
    let securityControlGroups = this.modelFor('gridiron-setup.security-controls');
    let transition;

    securityControlGroups.forEach((group, index) => {
      let next = securityControlGroups[index + 1];
      if (group.handle === handle && next) {
        transition = this.transitionTo('gridiron-setup.security-controls.show', next);
      }
    });

    // If we are at the end, but there are unfinished security-control groups
    // we should redirect back to the index;
    if (!transition && securityControlGroups.filterBy('completed', false).length > 1) {
      transition = this.transitionTo('gridiron-setup.security-controls');
    }

    if (!transition) {
      // All steps complete, transition to finish step
      this.finish();
    }
  },

  transitionToPreviousGroup() {
    let handle = this.currentModel.handle;
    let securityControlGroups = this.modelFor('gridiron-setup.security-controls');
    let transition;

    securityControlGroups.forEach((group, index) => {
      let previous = securityControlGroups[index - 1];

      if (group.handle === handle && previous) {
        transition = this.transitionTo('gridiron-setup.security-controls.show', previous);
      }
    });

    if (!transition) {
      this.transitionTo('gridiron-setup.security-controls');
    }
  },

  actions: {
    onPrevious() {
      this.transitionToPreviousGroup();
    },

    onNext() {
      this.save().then(() => {
        this.transitionToNextGroup();
        Ember.set(this.currentModel, 'completed', true);
      });
    },

    onSave() {
      this.save();
    }
  }
});
