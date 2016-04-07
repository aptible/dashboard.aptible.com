import Ember from 'ember';
import Attestation from 'sheriff/models/attestation';
import SPDRouteMixin from 'sheriff/mixins/routes/spd-route';
import buildSecurityControlGroups from 'sheriff/utils/build-security-control-groups';

export default Ember.Route.extend(SPDRouteMixin, {
  stepName: 'security-controls',
  model() {
    return this.modelFor('setup.security-controls');
  },

  setupController(controller, model) {
    let organizationUrl = this.modelFor('organization').get('data.links.self');

    controller.set('model', model);
    controller.set('organizationUrl', organizationUrl);
  },

  finish() {
    let profile = this.modelFor('setup');
    profile.setProperties({ hasCompletedSetup: true, step: 'finish' });

    profile.save().catch((e) => {
      let message = Ember.getWithDefault(e, 'responseJSON.message', 'An error occured');
      Ember.get(this, 'flashMessages').danger(`Save Failed! ${message}`);
    });

    this.transitionTo('setup.finish');
  },

  actions: {
    onNext() {
      let transition;

      this.currentModel.forEach((securityControlGroup) => {
        if (!securityControlGroup.completed && !transition) {
          transition = this.transitionTo('setup.security-controls.show', securityControlGroup);
        }
      });

      if (!transition) {
        transition = this.finish();
      }
    }
  }
});
