import Ember from 'ember';
import UserOrganizationContext from 'diesel/utils/user-organization-context';

// Use this service to consolidate logical functions that require several models
// in order to make a decision.  A good example of this is permission and role
// checks.

export default Ember.Service.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service(),

  load() {
    let { session, store } = this.getProperties('session', 'store');
    let currentUser = session.get('currentUser');

    return new Ember.RSVP.Promise((resolve) => {
      // Load basics
      Ember.RSVP.hash({
        stacks: store.find('stack'),
        organizations: store.find('organization'),
        currentUserRoles: session.get('currentUser.roles'),
        currentUser: session.get('currentUser')
      })
      .then((initialParams) => {
        this.setProperties(initialParams);

        //For each organization, eagerly load their entire context
        let { organizations, stacks, currentUserRoles } = initialParams;

        let contextPromises = organizations.map((organization) => {
          return UserOrganizationContext.create({
            organization, currentUserRoles, stacks, currentUser
          }).load();
        });

        return Ember.RSVP.all(contextPromises);
      })
      .then((organizationContexts) => {
        this.setProperties({ organizationContexts });
        resolve(this);
      });
    });
  },

  getContext(organizationId) {
    return this.get('organizationContexts').findBy('organization.id', organizationId);
  },

  hasSingleOrganization: Ember.computed.equal('organizationContexts.length', 1),
  hasNoOrganizations: Ember.computed.equal('organizationContexts.length', 0),
  hasNoStacks: Ember.computed.equal('stacks.length', 0),
  contextsWithEnclaveAccess: Ember.computed.filterBy('organizationContexts', 'hasEnclaveAccess', true),
  hasAnyEnclaveAccess: Ember.computed.gt('contextsWithEnclaveAccess.length', 0),
});
