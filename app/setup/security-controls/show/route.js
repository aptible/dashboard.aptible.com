import Ember from 'ember';
import Attestation from 'sheriff/models/attestation';
import SPDRouteMixin from 'sheriff/mixins/routes/spd-route';
import buildSecurityControlGroups from 'sheriff/utils/build-security-control-groups';

export default Ember.Route.extend(SPDRouteMixin, {
  stepName: 'security-controls',

  model(params) {
    let securityControlGroups = this.modelFor('setup.security-controls');
    return securityControlGroups.findBy('handle', params.handle);
  },

  save() {
    let { schemaDocument, attestation } = this.currentModel;

    attestation.set('document', schemaDocument.dump());
    Ember.set(this.currentModel, 'completed', true);
    return attestation.save();
  },

  setupController(controller, model) {
    let securityControlGroups = this.modelFor('setup.security-controls');

    controller.set('model', model);
    controller.set('securityControlGroups', securityControlGroups);
  },

  transitionToNextGroup() {
    let handle = this.currentModel.handle;
    let securityControlGroups = this.modelFor('setup.security-controls');
    let transition;

    securityControlGroups.forEach((group, index) => {
      let next = securityControlGroups[index + 1];
      if (group.handle === handle && next) {
        transition = this.transitionTo('setup.security-controls.show', next);
      }
    });

    // If we are at the end, but there are unfinished security-control groups
    // we should redirect back to the index;
    if (!transition && securityControlGroups.filterBy('completed', false).length > 1) {
      transition = this.transitionTo('setup.security-controls');
    }

    if (!transition) {
      // All steps complete, transition to finish step
      this.next();
    }
  },

  actions: {
    onPrevious() {
      this.transitionTo('setup.security-controls');
    },

    onNext() {
      this.save().then(() => { this.transitionToNextGroup(); });
    }
  }
});
