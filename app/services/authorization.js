import Ember from 'ember';
import UserOrganizationContext from 'diesel/utils/user-organization-context';
import Stack from 'diesel/models/stack';
import Organization from 'diesel/models/organization';
import Role from 'diesel/models/role';

// Use this service to consolidate logical functions that require several models
// in order to make a decision.  A good example of this is permission and role
// checks.

export default Ember.Service.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service(),

  load() {
    let { session, store } = this.getProperties('session', 'store');
    let currentUser = session.get('currentUser');

    return new Ember.RSVP.Promise((resolve, reject) => {
      // Load basics
      // TODO:  We should load the current users memberships here too, however
      // that requires an auth change.  There is curretnly no link to memberships from a user
      // Even better, we should embed memberships for roles and users.
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
          let userContextRoles = currentUserRoles.filterBy('data.links.organization', organization.get('data.links.self'));

          return UserOrganizationContext.create({
            organization, stacks, currentUser, currentUserRoles: userContextRoles
          }).load();
        });

        return Ember.RSVP.all(contextPromises);
      })
      .then((organizationContexts) => {
        this.setProperties({ organizationContexts });
        resolve(this);
      })
      .catch((e) => reject(e));
    });
  },

  getContext(organizationId) {
    return this.get('organizationContexts').findBy('organization.id', organizationId);
  },

  getContextByHref(organizationHref) {
    return this.get('organizationContexts').findBy('organization.data.links.self', organizationHref);
  },

  checkAbility(scope, permittable) {
    let context;

    if (permittable instanceof Stack) {
      context = this.getContextByHref(permittable.get('data.links.organization'));
      return context.hasStackScope(scope, permittable);
    }

    if(permittable instanceof Organization) {
      context = this.getContext(permittable.get('id'));
      return context.hasOrganizationScope(scope);
    }

    if(permittable instanceof Role) {
      context = this.getContextByHref(permittable.get('data.links.organization'));
      return context.hasRoleScope(scope, permittable);
    }
  },

  hasSingleOrganization: Ember.computed.equal('organizationContexts.length', 1),
  hasNoOrganizations: Ember.computed.equal('organizationContexts.length', 0),
  hasNoStacks: Ember.computed.equal('stacks.length', 0),
  contextsWithEnclaveAccess: Ember.computed.filterBy('organizationContexts', 'userHasEnclaveAccess', true),
  hasAnyEnclaveAccess: Ember.computed.gt('contextsWithEnclaveAccess.length', 0),

  contextsWithEnclaveProduct: Ember.computed.filterBy('organizationContexts', 'organizationHasEnclaveProduct', true),
  contextsWithGridironProduct: Ember.computed.filterBy('organizationContexts', 'organizationHasGridironProduct', true),
  hasAnyOrganizationsWithEnclaveProduct: Ember.computed.gt('contextsWithEnclaveProduct.length', 0),
  hasAnyOrganizationsWithGridironProduct: Ember.computed.gt('contextsWithGridironProduct.length', 0)
});
