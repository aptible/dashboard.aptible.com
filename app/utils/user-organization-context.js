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

  hasNoBillingDetail: Ember.computed.equal('billingDetail.isRejected', true),
  hasBillingDetail: Ember.computed.not('hasNoBillingDetail'),

  platformUserRoles: Ember.computed.filterBy('currentUserRoles', 'type', 'platform_user'),
  platformAdminRoles: Ember.computed.filterBy('currentUserRoles', 'type', 'platform_owner'),
  gridironUserRoles: Ember.computed.filterBy('currentUserRoles', 'type', 'compliance_user'),
  gridironAdminRoles: Ember.computed.filterBy('currentUserRoles', 'type', 'compliance_owner'),
  organizationAdminRoles: Ember.computed.filterBy('currentUserRoles', 'type', 'owner'),

  isEnclaveUser: Ember.computed.gt('platformUserRoles.length', 0),
  isEnclaveAdmin: Ember.computed.gt('platformAdminRoles.length', 0),
  isGridironAdmin: Ember.computed.gt('gridironAdminRoles.length', 0),
  isOrganizationAdmin: Ember.computed.gt('organizationAdminRoles.length', 0),

  hasEnclaveAccess: Ember.computed.or('isEnclaveUser', 'isOrganizationAdmin')
});
