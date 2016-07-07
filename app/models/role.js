import DS from 'ember-data';

export const PRIVILEGED_ROLE_TYPES = [
  "owner",
  "platform_owner",
  "compliance_owner"
];

export const COMPLIANCE_ROLE_TYPES = [
  "owner",
  "compliance_owner",
  "compliance_user"
];

export const PLATFORM_ROLE_TYPES = [
  "owner",
  "platform_owner",
  "platform_user"
];

export const USER_ROLE_TYPES = {
  platform_user: 'Platform',
  compliance_user: 'Compliance'
};

export default DS.Model.extend({
  name: DS.attr(),
  type: DS.attr({ defaultValue: 'platform_user' }),
  organization: DS.belongsTo('organization', {async: true}),
  memberships: DS.hasMany('membership', {async:true}),
  invitations: DS.hasMany('invitations', {async:true}),
  users: DS.hasMany('users', {async:true}),

  isOwner: Ember.computed('type', function() {
    return this.get('type') === 'owner';
  }),

  isComplianceOwner: Ember.computed('type', function() {
    return this.get('type') === 'compliance_owner';
  }),

  isComplianceUser: Ember.computed('type', function() {
    return this.get('type') === 'compliance_user';
  }),

  isPlatformOwner: Ember.computed('type', function() {
    return this.get('type') === 'platform_owner';
  }),

  isPlatformUser: Ember.computed('type', function() {
    return this.get('type') === 'platform_user';
  }),

  requiresPermissions: Ember.computed.equal('type', 'platform_user'),

  privileged: Ember.computed('type', function() {
    return PRIVILEGED_ROLE_TYPES.indexOf(this.get('type')) > -1;
  }),

  isCompliance: Ember.computed('type', function() {
    return COMPLIANCE_ROLE_TYPES.indexOf(this.get('type')) > -1;
  }),

  isPlatform: Ember.computed('type', function() {
    return PLATFORM_ROLE_TYPES.indexOf(this.get('type')) > -1;
  }),

  persistedInvitations: Ember.computed('invitations.[]', function() {
    return this.get('invitations').rejectBy('isNew');
  })
});
