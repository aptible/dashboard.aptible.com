import Ember from 'ember';

export default Ember.Route.extend({
  complianceStatus: Ember.inject.service(),

  model() {
    let organization = this.get('complianceStatus.organization');
    let user = this.get('session.currentUser');
    let findDocuments = { user: user.get('data.links.self'),
                          organization: organization.get('data.links.self') };

    return this.store.find('document', findDocuments);
  },

  setupController(controller, model) {
    let documents = model;
    let complianceStatus = this.get('complianceStatus');
    let authorizationContext = complianceStatus.get('authorizationContext');
    let userId = this.get('session.currentUser.id');
    let userStatus = complianceStatus.get('training.userStatuses').findBy('user.id', userId);
    if(userStatus) {
      userStatus.set('userDocuments', documents);
    }

    controller.setProperties({ model, authorizationContext, complianceStatus, userStatus });
  }
});
