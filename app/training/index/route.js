import Ember from 'ember';
import TrainingEnrollmentStatus from 'diesel/utils/training-enrollment-status';

export default Ember.Route.extend({
  complianceStatus: Ember.inject.service(),
  model() {
    let organization = this.get('complianceStatus.organization');

    return this.get('complianceStatus.users').map((user) => {
      let documentQuery = { user: user.get('data.links.self'),
                            organization: organization.get('data.links.self') };
      let documents = this.store.find('document', documentQuery);

      let isSecurityOfficer = user.get('data.links.self') === organization.get('data.links.security_officer');
      return new TrainingEnrollmentStatus({ user, documents, isSecurityOfficer });
    });
  },

  setupController(controller, model) {
    let organization = this.get('complianceStatus.organization');
    let criteria = this.modelFor('training');

    controller.set('criteria', criteria);
    controller.set('model', model);
    controller.set('organization', organization);
  }
});
