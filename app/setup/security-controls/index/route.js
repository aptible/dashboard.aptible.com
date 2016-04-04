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
});
