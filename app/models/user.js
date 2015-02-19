import DS from 'ember-data';
import can from "../utils/can";

export default DS.Model.extend({
  email: DS.attr('string'),
  name: DS.attr('string'),
  username: DS.attr('string'),
  password: DS.attr('string'),

  // used when changing a user's password. Set as an `attr` so that it
  // will be sent to the API
  currentPassword: DS.attr('string'),

  // not persisted, used when changing a user's password
  passwordConfirmation: null,

  // relationships
  token: DS.belongsTo('token', {async: true}),
  roles: DS.hasMany('role', {async:true}),
  //organizations: DS.hasMany('organization', {async:true}),
  sshKeys: DS.hasMany('ssh-key', {async:true}),

  // check ability, returns a promise
  // e.g.: user.can('manage', stack).then(function(boolean){ ... });
  can: function(scope, stack){
    return can(this, scope, stack);
  },

  organizations: function() {
    var organizations = [];

    this.get('roles').forEach(function(role) {
      var organizationId = role.get('_data.links.organization');
      var organization = organizations.findBy('organizationId', organizationId);

      if(!organization) {
        organization = {
          organizationId: organizationId,
          organization: role.get('organization')
        };
        organizations.push(organization);
      }
    });

    return organizations.map(function(organization) {
      return organization.organization;
    });

  }.property('roles.[]')

});
