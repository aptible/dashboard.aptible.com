import Ember from 'ember';
import { findUserBy } from 'sheriff/utils/build-team-document';

export default Ember.Route.extend({
  model() {
    let organization = this.modelFor('organization');
    let workforceAttestation = this.modelFor('training').attestation.get('document');


    let activeUsers = organization.get('users').map((user) => {
      let settings = findUserBy(workforceAttestation, 'email', user.get('email'))
      let findDocuments = { user: user.get('data.links.self'),
                            organization: organization.get('data.links.self') }
      return { user, settings,
               documents: this.store.find('document', findDocuments) };
    });

    let robots = workforceAttestation.filterBy('isRobot', true);
    let pendingInvitations = workforceAttestation.filterBy('hasAptibleAccount', false);

    return  { activeUsers, robots, pendingInvitations };
  },

  setupController(controller, model) {
    let organization = this.modelFor('organization');
    let criteria = this.modelFor('training').criteria;

    controller.set('criteria', criteria);
    controller.set('model', model.activeUsers);
    controller.set('robots', model.robots);
    controller.set('pendingInvitations', model.pendingInvitations);
    controller.set('organization', organization);
  }
});
