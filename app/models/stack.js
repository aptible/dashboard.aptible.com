import Ember from 'ember';
import DS from 'ember-data';

let roleUrlRegex = new RegExp('/roles/([a-zA-Z0-9\-]+)$');

function getRoleIdFromPermission(permission){
  var roleUrl = permission.get('data.links.role');
  return roleUrlRegex.exec(roleUrl)[1];
}

export default DS.Model.extend({
  // properties
  name: DS.attr('string'),
  handle: DS.attr('string'),
  number: DS.attr('string'),
  type: DS.attr('string'),
  syslogHost: DS.attr('string'),
  syslogPort: DS.attr('string'),
  organizationUrl: DS.attr('string'),
  activated: DS.attr('boolean'),
  containerCount: DS.attr('number'),
  appContainerCount: DS.attr('number'),
  databaseContainerCount: DS.attr('number'),
  domainCount: DS.attr('number'),
  totalAppCount: DS.attr('number'),
  totalDatabaseCount: DS.attr('number'),
  totalDiskSize: DS.attr('number'),

  // relationships
  apps: DS.hasMany('app', {async: true}),
  certificates: DS.hasMany('certificate', {async: true}),
  databases: DS.hasMany('database', {async: true}),
  permissions: DS.hasMany('permission', {async:true}),
  organization: DS.belongsTo('organization', {async:true}),
  logDrains: DS.hasMany('log-drain', {async:true}),
  vhosts: DS.hasMany('vhost', {async:true}),

  // computed properties
  pending: Ember.computed.not('activated'),
  allowPHI: Ember.computed.match('type', /production/),
  appContainerCentsPerHour: 8,

  getUsageByResourceType(type) {
    let usageAttr = { container: 'containerCount', disk: 'totalDiskSize',
                      domain: 'domainCount' }[type];
    return this.get(usageAttr);
  },

  permitsRole(role, scope){
    let permissions;

    if (role.get('privileged') &&
        role.get('data.links.organization') === this.get('data.links.organization')) {
      return new Ember.RSVP.Promise((resolve) => {
        resolve(true);
      });
    }

    return this.get('permissions').then(function(_permissions){
      permissions = _permissions;

      return permissions.map(function(perm){
        return {
          roleId: getRoleIdFromPermission(perm),
          scope:  perm.get('scope')
        };
      });
    }).then(function(stackRoleScopes){
      return Ember.A(Ember.A(stackRoleScopes).filter((stackRoleScope) => {
        return role.get('id') === stackRoleScope.roleId;
      })).any((stackRoleScope) => {
        return stackRoleScope.scope === 'manage' ||
          stackRoleScope.scope === scope;
      });
    });
  }
});
