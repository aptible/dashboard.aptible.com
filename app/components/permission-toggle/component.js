import Ember from 'ember';

export default Ember.Component.extend({
  busy: false,
  hasPermissions: Ember.computed.gt('permissions.length', 0),
  initialized: false,
  permission: null,
  store: Ember.inject.service(),

  setup: function() {
    Ember.run.next(() => {
      this.set('initialized', true);
    });
  }.on('init'),

  isChecked: Ember.computed('stack.@each.permissions', function() {
    if (this.get('role').get('requiresPermissions')) {
      return this.get('stack').hasRoleScope(this.get('role'), this.get('scope'));
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

  actions: {
    onToggle(isOn) {
      // NOTE: This version of the toggle component calls onToggle on init,
      // so we return if that's the case.
      if (!this.get('initialized') || this.get('busy')) { return; }

      let role = this.get('role');
      let scope = this.get('scope');
      let stack = this.get('stack');
      let permission = stack.findPermission(role, scope);

      // NOTE: No error occurs if a permission with this role and scope already
      // exist for this stack. Including this check to avoid a duplicate.
      if (isOn && permission === undefined) { return; }

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
