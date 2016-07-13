import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  type: DS.attr({ defaultValue: 'platform_user' }),
  organization: DS.belongsTo('organization', {async: true}),
  memberships: DS.hasMany('membership', {async:true}),
  invitations: DS.hasMany('invitations', {async:true}),
  users: DS.hasMany('users', {async:true}),

  isAccountOwner: Ember.computed.equal('type', 'owner'),
  isComplianceOwner: Ember.computed.equal('type', 'compliance_owner'),
  isPlatformOwner: Ember.computed.equal('type', 'platform_owner'),
  isComplianceUser: Ember.computed.equal('type', 'compliance_user'),
  isPlatformUser: Ember.computed.equal('type', 'platform_user'),

  isOwner: Ember.computed.or('isAccountOwner', 'isPlatformOwner', 'isComplianceOwner'),
  isUser: Ember.computed.or('isPlatformUser', 'isComplianceUser'),
  isCompliance: Ember.computed.or('isAccountOwner', 'isComplianceOwner', 'isComplianceUser'),
  isPlatform: Ember.computed.or('isAccountOwner', 'isPlatformOwner', 'isPlatformUser'),

  privileged: Ember.computed.deprecatingAlias('isOwner'),

  persistedInvitations: Ember.computed('invitations.[]', function() {
    return this.get('invitations').rejectBy('isNew');
  })
});
