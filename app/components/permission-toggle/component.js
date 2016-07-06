import Ember from 'ember';

export default Ember.Component.extend({
  hasPermissions: Ember.computed.gt('permissions.length', 0),
  permission: null,

  init() {
    let stack = this.get('stack');
    let role = this.get('role');
    let scope = this.get('scope');

    stack.permissionForRole(role, scope).then(function(permission) {
      this.set('permission', permission);
      console.log(permission, permission.get('scope'));
    });
  },

  isChecked: Ember.computed('stack.@each.permissions', 'permission.scope', function() {
    if (this.get('role').get('requiresPermissions')) {
      return this.get('stack').permitsRole(this.get('role'), this.get('scope'));
    }
    return true;
  }),

  isDisabled: Ember.computed('currentUser.roles.[]', function() {
    let currentUserRoles = this.get('currentUserRoles');
    if (this.get('role').get('requiresPermissions')) {
      return this.get('currentUser').isPlatformOwner(currentUserRoles);
    }
    return true;
  }),

  onToggle(permission) {
    permission.save();
  }
});
