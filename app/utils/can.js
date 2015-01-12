import Ember from 'ember';

var roleUrlRegex = new RegExp('/roles/([a-zA-Z0-9\-]+)$');

function getRoleIdFromPermission(permission){
  var roleUrl = permission.get('data.links.role');

  if (roleUrl && roleUrlRegex.test(roleUrl)) {
    var id = roleUrlRegex.exec(roleUrl)[1];

    return Ember.RSVP.resolve(id);
  } else {
    return permission.get('role').then(function(role){
      return role.get('id');
    });
  }
}

export default function can(user, targetScope, stack){
  var userRoleIds,      // role ids this user has
      stackPermissions; // permissions this stack has

  if (user._isPrivileged) {
    // if we already determined that the user is privileged,
    // can skip the rest of the checks
    return Ember.RSVP.resolve(true);
  }

  return user.get('roles').then(function(roles){
    if (roles.isAny('privileged')) {

      // 'privileged' user can skip the rest of the checks
      user._isPrivileged = true;
      return true;
    }

    userRoleIds = roles.mapBy('id');

    // mapping of role id and permission's scope:
    // [{roleId: X, scope: Y}, ...]
    return stack.get('permissions').then(function(permissions){
      stackPermissions = permissions;

      var stackMappingPromises = stackPermissions.map(function(perm){
        return getRoleIdFromPermission(perm).then(function(roleId){
          return {
            roleId: roleId,
            scope:  perm.get('scope')
          };
        });
      });

      return Ember.RSVP.all(stackMappingPromises);
    }).then(function(stackRoleMap){

      return stackRoleMap.any(function(roleMapping){

        // skip if user does not have this role
        if (!userRoleIds.contains(roleMapping.roleId)) {
          return;
        }

        // check if the role has the right permission scope
        return roleMapping.scope === 'manage' ||
          roleMapping.scope === targetScope;
      });
    });
  });
}
