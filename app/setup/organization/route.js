import Ember from 'ember';
import SPDRouteMixin from 'diesel/mixins/routes/spd-route';
import { humanize } from 'diesel/utils/attestation-validation-error';

export default Ember.Route.extend(SPDRouteMixin, {
  complianceStatus: Ember.inject.service(),
  model() {
    return this.modelFor('setup');
  },

  setupController(controller, model) {
    let organization = this.get('complianceStatus.organization');
    controller.set('organization', organization);
    controller.set('model', model);
  },

  actions: {
    onSave() {
      var organizationProfile = this.modelFor('setup');
      // We could validate the controller here, but I'm choosing not to.  By
      // not validating the controller, we allow the user to save progress
      // even though they may not have completed the entirety of the interview.
      organizationProfile.save().then(() => {
        let message = 'Progress saved.';
        Ember.get(this, 'flashMessages').success(message);
      }, (e) => {
        let message = Ember.getWithDefault(e, 'responseJSON.message', 'An error occured');
        Ember.get(this, 'flashMessages').danger(`Save Failed! ${message}`);
      });
    }
  }
});
