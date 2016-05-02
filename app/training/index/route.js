import Ember from 'ember';
import { findUserBy } from 'diesel/utils/build-team-document';
import TrainingEnrollmentStatus from 'diesel/utils/training-enrollment-status';

export default Ember.Route.extend({
  model() {
    let organization = this.modelFor('compliance-organization');
    let workforceAttestation = this.modelFor('training').attestation.get('document');

    // Map all users into a TrainingEnrollmentStatus object
    let activeUsers = organization.get('users').map((user) => {
      let settings = findUserBy(workforceAttestation, 'email', user.get('email'));
      let documentQuery = { user: user.get('data.links.self'),
                            organization: organization.get('data.links.self') };
      let documents = this.store.find('document', documentQuery);

      return new TrainingEnrollmentStatus({ user, settings, documents });
    });

    let robots = workforceAttestation.filterBy('isRobot', true);
    let pendingInvitations = workforceAttestation.filterBy('hasAptibleAccount', false);

    return  { activeUsers, robots, pendingInvitations };
  },

  setupController(controller, model) {
    let organization = this.modelFor('compliance-organization');
    let criteria = this.modelFor('training').criteria;

    controller.set('criteria', criteria);
    controller.set('model', model.activeUsers);
    controller.set('robots', model.robots);
    controller.set('pendingInvitations', model.pendingInvitations);
    controller.set('organization', organization);
  }
});
