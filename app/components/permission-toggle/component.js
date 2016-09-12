import Ember from 'ember';

export default Ember.Component.extend({
  busy: false,
  hasPermissions: Ember.computed.gt('permissions.length', 0),
  permission: null,
  store: Ember.inject.service(),

  init() {
    this._super(...arguments);
    Ember.run.later(() => this.set('initialized', true));
  },

  isChecked: Ember.computed('stack.permissions.[]', function() {
    return this.get('stack').hasRoleScope(this.get('role'), this.get('scope'));
  }),

  roleIsOwner: Ember.computed.or('role.isAccountOwner', 'role.isPLatformOwner'),
  ownerTooltipTitle: Ember.computed('role.name', 'stack.handle', function() {
    return `${this.get('role.name')} is granted all permissions for ${this.get('stack.handle')}`;
  }),
  userIsAuthorized: Ember.computed.reads('authorizationContext.userIsEnclaveOrOrganizationAdmin'),
  userIsUnauthorized: Ember.computed.not('userIsAuthorized'),

  actions: {
    onToggle(valueOptions) {
      if(!this.get('initialized')) {
        return;
      }
      let isOn = !!valueOptions.newValue;
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
          role
        }).save().then(() => { this.set('busy', false); });
      }
      else {
        permission.destroyRecord().then(() => {
          this.set('busy', false);
        });
      }

      return true;
    }
  }
});
