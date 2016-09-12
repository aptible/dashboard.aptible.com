import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  email: DS.attr('string'),
  name: DS.attr('string'),
  username: DS.attr('string'),
  password: DS.attr('string'),
  verified: DS.attr('boolean'),
  createdAt: DS.attr('date'),
  superuser: DS.attr('boolean'),
  otpEnabled: DS.attr('boolean'),

  // Used when enabling 2FA. Set as an `attr` so that it's sent to the API.
  otpToken: DS.attr('string'),

  // relationships
  // REVIEW: We used to have a 'token' attribute. It's unclear where this was
  // used (if at all). Do we want to create a Ember.computed 'token' field for
  // backwards compatibility?
  memberships: DS.hasMany('membership', { async: true }),
  tokens: DS.hasMany('token', { async: true, requireReload: true }),
  roles: DS.hasMany('role', { async: true }),
  sshKeys: DS.hasMany('ssh-key', { async: true }),
  otpConfigurations: DS.hasMany('otp-configuration', { async: true }),

  currentOtpConfiguration: DS.belongsTo('otp-configuration', { async: true }),

  isRoleType(types, roles, organization) {
    Ember.assert('You must pass types to check against', !!types);
    Ember.assert('You must pass the user\'s current roles', !!roles);
    Ember.assert('You must pass an organization', !!organization);

    const organizationUrl = organization.get('data.links.self');
    return roles.filterBy('data.links.organization', organizationUrl)
                .reduce(function(prev, role) {
                  return prev || types.indexOf(role.get('type')) > -1;
                }, false);
  },

  isAccountOwner(roles, organization) {
    return this.isRoleType(['owner'], roles, organization);
  },

  isOwner(roles, organization) {
    let types = ['owner', 'platform_owner', 'compliance_owner'];
    return this.isRoleType(types, roles, organization);
  },

  isComplianceOwner(roles, organization) {
    return this.isRoleType(['compliance_owner'], roles, organization);
  },

  isPlatformOwner(roles, organization) {
    return this.isRoleType(['platform_owner'], roles, organization);
  },

  organizations: Ember.computed('roles.@each.organization', function() {
    var organizations = {};

    this.get('roles').forEach(function(role) {
      var organization = role.get('organization');
      var organizationId = organization.get('id');
      organizations[organizationId] = organization;
    });

    return Ember.keys(organizations).map(function(organizationId) {
      return organizations[organizationId];
    });

  }),

  findMembership(memberships) {
    return memberships.findBy('user.id', this.get('id'));
  }
});
