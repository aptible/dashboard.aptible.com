import Ember from 'ember';

export default Ember.Component.extend({
  busy: false,
  hasPermissions: Ember.computed.gt('permissions.length', 0),
  permission: null,
  store: Ember.inject.service(),

  isChecked: Ember.computed('stack.@each.permissions', function() {
    if (this.get('role').get('isPlatformUser')) {
      return this.get('stack').hasRoleScope(this.get('role'), this.get('scope'));
    }
    return true;
  }),

  isDisabled: Ember.computed('currentUser.roles.[]', function() {
    let currentUserRoles = this.get('currentUserRoles');
    if (this.get('role').get('isPlatformUser')) {
      return !this.get('currentUser').canManagePlatform(currentUserRoles, this.get('organization'));
    }
    return true;
  }),

  actions: {
    onToggle(valueOptions) {
      let isOn = valueOptions.newValue;
      if([true,false].indexOf(isOn) === -1) {
        // Not a valid boolean value
        return;
      }
      let { role, scope, stack } = this.getProperties('role', 'scope', 'stack');
      let permission = stack.findPermission(role, scope);

      // NOTE: No error occurs if a permission with this role and scope already
      // exist for this stack. Including this for an existing permission to
      // avoid a duplicate.
      if (isOn && permission !== undefined) { return; }

      this.set('busy', true);
      if (isOn) {
        this.get('store').createRecord('permission', {
          stack,
          scope,
          role: role.get('data.links.self')
        }).save().then(() => { this.set('busy', false); });
      }
      else {
        permission.destroyRecord().then(() => {
          this.set('busy', false);
        });
      }
    }
  }
});
