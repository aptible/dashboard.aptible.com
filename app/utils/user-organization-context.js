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
    return new Ember.RSVP.Promise((resolve) => {
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

        resolve(this);
      });
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

  hasNoBillingDetail: Ember.computed.equal('billingDetail.isRejected', true),
  hasBillingDetail: Ember.computed.not('hasNoBillingDetail'),

  // Computeds related to user's roles in organization
  userPlatformUserRoles: Ember.computed.filterBy('currentUserRoles', 'type', 'platform_user'),
  userPlatformAdminRoles: Ember.computed.filterBy('currentUserRoles', 'type', 'platform_owner'),
  userGridironUserRoles: Ember.computed.filterBy('currentUserRoles', 'type', 'compliance_user'),
  userGridironAdminRoles: Ember.computed.filterBy('currentUserRoles', 'type', 'compliance_owner'),
  userOrganizationAdminRoles: Ember.computed.filterBy('currentUserRoles', 'type', 'owner'),
  userIsEnclaveUser: Ember.computed.gt('userPlatformUserRoles.length', 0),
  userIsEnclaveAdmin: Ember.computed.gt('userPlatformAdminRoles.length', 0),
  userIsGridironAdmin: Ember.computed.gt('userGridironAdminRoles.length', 0),
  userIsOrganizationAdmin: Ember.computed.gt('userOrganizationAdminRoles.length', 0),

  hasEnclaveAccess: Ember.computed.or('userIsEnclaveUser', 'userIsOrganizationAdmin')
});
