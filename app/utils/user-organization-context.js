import Ember from 'ember';

// This class is meant to bootstrap all models required to render dashboard
// for a given organizations' users.  It also provides a context to be used
// for difficult computations based on the current user and their relationship
// to their organization, e.g. permission checks

// UserOrganizationContext should be instantiated with the following

// * organization
// * currentUserRoles
// * stacks (all stacks for given user, this service will filter)
// * currentUser

export default Ember.Object.extend({
  store: Ember.inject.service(),

  load() {
    let { organization } = this.getProperties('organization');
    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.RSVP.hash({
        users: organization.get('users'),
        invitations: organization.get('invitations'),
        roles: organization.get('roles'),
        billingDetail: organization.get('billingDetail').catch(Ember.$.noop),
        securityOfficer: organization.get('securityOfficer'),
      })
      .then((props) => {
        // Find all stacks for this organizations
        let organizationHref = this.get('organization.data.links.self');
        props.stacks = this.get('stacks').filterBy('data.links.organization', organizationHref);

        // All basic relationships are loaded, store those and load permissions
        this.setProperties(props);
        return Ember.RSVP.all(props.stacks.map((s) => s.get('permissions')));
      })
      .then((permissionsByStack) => {
        let permissions = [];

        permissionsByStack.forEach((stackPermissions) => {
          permissions = permissions.concat(stackPermissions);
        });

        this.set('permissions', permissions);

        if (this.get('hasBillingDetail')) {
          return this.get('billingDetail.billingContact');
        }
      })
      .then((billingContact) => {
        this.set('billingContact', billingContact);
        resolve(this);
      })
      .catch((e) => reject(e));
    });
  },

  // Computed related to organization's roles
  organizationOwnerRoles: Ember.computed.filterBy('roles', 'type', 'owner'),
  organizationPlatformUserRoles: Ember.computed.filterBy('roles', 'type', 'platform_user'),
  organizationPlatformAdminRoles: Ember.computed.filterBy('roles', 'type', 'platform_owner'),
  organizationComplianceUserRoles: Ember.computed.filterBy('roles', 'type', 'compliance_user'),
  organizationComplianceAdminRoles: Ember.computed.filterBy('roles', 'type', 'compliance_owner'),
  organizationHasGridironProduct: Ember.computed.match('billingDetail.plan', /pilot|production/),

  // TODO: This will have to be a plan match once Enclave is separate from gridiron
  organizationHasEnclaveProduct: true,

  hasNoBillingDetail: Ember.computed.equal('billingDetail.', undefined),
  hasBillingDetail: Ember.computed.not('hasNoBillingDetail'),

  // Computeds related to user's roles in organization
  hasVerifiedEmail: Ember.computed.reads('currentUser.verified'),
  userPlatformUserRoles: Ember.computed.filterBy('currentUserRoles', 'type', 'platform_user'),
  userPlatformAdminRoles: Ember.computed.filterBy('currentUserRoles', 'type', 'platform_owner'),
  userGridironUserRoles: Ember.computed.filterBy('currentUserRoles', 'type', 'compliance_user'),
  userGridironAdminRoles: Ember.computed.filterBy('currentUserRoles', 'type', 'compliance_owner'),
  userOrganizationAdminRoles: Ember.computed.filterBy('currentUserRoles', 'type', 'owner'),
  userIsEnclaveUser: Ember.computed.gt('userPlatformUserRoles.length', 0),
  userIsEnclaveAdmin: Ember.computed.gt('userPlatformAdminRoles.length', 0),
  userIsGridironAdmin: Ember.computed.gt('userGridironAdminRoles.length', 0),
  userIsOrganizationAdmin: Ember.computed.gt('userOrganizationAdminRoles.length', 0),

  userIsEnclaveOrOrganizationAdmin: Ember.computed.or('userIsEnclaveAdmin', 'userIsOrganizationAdmin'),
  userIsGridironOrOrganizationAdmin: Ember.computed.or('userIsGridironAdmin', 'userIsOrganizationAdmin'),

  // Can the user use enclave? TODO revisit these two:
  userHasEnclaveAccess: Ember.computed.or('userIsEnclaveAdmin', 'userIsEnclaveUser'),
  hasEnclaveAccess: Ember.computed.or('userHasEnclaveAccess', 'userIsOrganizationAdmin'),
  // End

  doesUserHavePrivilegedMembershipForRole(role) {
    // This method is dumb and counts on memberhsips being loaded on the role
    // FIXME: Load memberships from users and cache them in this context
    let privilegedMemberships = role.get('memberships').filterBy('privileged', true);
    return !!privilegedMemberships.findBy('user.id', this.get('currentUser.id'));
  },

  hasStackScope(scope, stack) {
    // Scopes: read, manage
    if(scope === 'manage' && !this.get('hasVerifiedEmail')) {
      return false;
    }

    return this.get('currentUserRoles').any((role) => {
      return stack.permitsRole(role, scope);
    });
  },

  hasOrganizationScope(scope) {
    // Scopes: read, manage
    if(scope === 'read') {
      return true;
    }

    if(scope === 'manage' && !this.get('hasVerifiedEmail')) {
      return false;
    }

    return this.get('userIsOrganizationAdmin');
  },

  hasRoleScope(scope, role) {
    // Scopes: read, manage, invite
    if(scope === 'read') {
      return true;
    }

    if(scope === 'manage' && !this.get('hasVerifiedEmail')) {
      return false;
    }

    if(this.get('userIsOrganizationAdmin')) {
      return true;
    }

    if(role.get('isPlatform') && this.get('userIsEnclaveAdmin')) {
      return true;
    }

    if(role.get('isComplianceRole') && this.get('userIsGridironAdmin')) {
      return true;
    }

    if(scope === 'invite' && this.doesUserHavePrivilegedMembershipForRole(role)) {
      return true;
    }

    return false;
  }
});
