import DS from 'ember-data';
import can from "../utils/can";
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

  // check ability, returns a promise
  // e.g.: user.can('manage', stack).then(function(boolean){ ... });
  can: function(scope, stack){
    return can(this, scope, stack);
  },

  isAccountOwner(roles) {
    Ember.assert('You must pass roles', !!roles);

    return roles.reduce(function(prev, role) {
      return prev || role.get('type') === 'owner';
    }, false);
  },

  isOwner(roles) {
    Ember.assert('You must pass roles', !!roles);

    return roles.reduce(function(prev, role) {
      return prev || role.get('type').toString().indexOf('owner') > -1;
    }, false);
  },

  isComplianceOwner(roles) {
    Ember.assert('You must pass roles', !!roles);

    return roles.reduce(function(prev, role) {
      let type = role.get('type');
      return prev || (type === 'owner' || type === 'compliance_owner');
    }, false);
  },

  isPlatformOwner(roles) {
    Ember.assert('You must pass roles', !!roles);

    return roles.reduce(function(prev, role) {
      let type = role.get('type');
      return prev || (type === 'owner' || type === 'platform_owner');
    }, false);
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
