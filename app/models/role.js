import DS from 'ember-data';
import Ember from 'ember';

let Role = DS.Model.extend({
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

  persistedInvitations: Ember.computed.filterBy('invitations', 'isNew', false)
});

Role.reopenClass({
  // Find or create will attempt to find a matching role given a particular
  // organization and some params.  If a matching role does not exist, one is
  // created. `name`, `type`, and `organization` are requried params.
  findOrCreate(params, store) {
    Ember.assert('You must provide an organization to `Role#findOrCreate`',
                 params.organization);
    Ember.assert('You must provide a type to `Role#findOrCreate`', params.type);
    Ember.assert('You must provide a name to `Role#findOrCreate`', params.name);

    return new Ember.RSVP.Promise((resolve) => {
      params.organization.get('roles').then((roles) => {
        let role = roles.find((role) => {
          if(params.name && role.get('name') !== params.name) {
            return false;
          }

          if(params.type && role.get('type') !== params.type) {
            return false;
          }

          return true;
        });

        if(role) {
          resolve(role);
        } else {
          resolve(store.createRecord('role', params));
        }
      });
    });
  }
});

export default Role;