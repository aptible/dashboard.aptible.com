import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['aptable__member-row'],
  tagName: 'tr',
  initialized: false,
  busy: false,
  memberUserRoles: [],
  currentUserRoles: [],

  setup: function() {
    this.get('membership.user.roles').then((roles) => {
      this.set('memberUserRoles', roles);
    });
    this.get('currentUser.roles').then((roles) => {
      this.set('currentUserRoles', roles);
    });
    Ember.run.next(() => {
      this.set('initialized', true);
    });
  }.on('init'),

  hasOwnerShield: Ember.computed('memberUserRoles.[]', function() {
    let user = this.get('membership.user');
    return this.isRoleOwner(user, this.get('memberUserRoles'));
  }),

  isRoleOwner(user, roles) {
    if (this.get('role.isCompliance')) {
      return user.isComplianceOwner(roles, this.get('organization'));
    }
    return user.isPlatformOwner(roles, this.get('organization'));
  },

  // Account | Platform | Compliance Owners effectively have admin privileges,
  // so it gets toggled and disabled.
  isToggled: Ember.computed('membership.privileged', 'memberUserRoles.[]', function() {
    return this.isRoleOwner(this.get('membership.user'), this.get('memberUserRoles')) ||
      this.get('membership.privileged');
  }),

  isDisabled: Ember.computed('memberUserRoles.[]', 'currentUserRoles.[]', function() {
    if (this.get('role.isOwner')) { return true; }

    // Disable if current user is not a role owner
    if (!this.isRoleOwner(this.get('currentUser'), this.get('currentUserRoles'))) {
      return true;
    }
    // If current user is a role owner, check this role member and disable
    // if they are an owner
    return this.isRoleOwner(this.get('membership.user'), this.get('memberUserRoles'));
  }),

  actions: {
    togglePrivileged(isOn) {
      let membership = this.get('membership');

      // No changes if this is the init call
      // NOTE: new versions of x-toggle don't call the toggle on init
      if (!this.get('initialized') || this.get('busy')) { return; }

      // No need to update if this user is an owner.
      if (this.isRoleOwner(membership.get('user'), this.get('memberUserRoles'))) { return; }

      membership.set('privileged', isOn);
      this.set('busy', true);
      membership.save().then(() => { this.set('busy', false); });
    },

    // Confirm deletes, also message that the user will be removed from the
    // org if this is their only role
    destroyMembership() {
      let role = this.get('role');
      let membership = this.get('membership');
      let user = membership.get('user');

      let subject = user.get('name');
      if (user.get('id') === this.get('currentUser.id')) {
        subject = 'yourself';
      }

      // Confirm...
      let confirmMsg = `\nAre you sure you want to remove ${subject} from ${role.get('name')}?\n`;
      if (!confirm(confirmMsg)) { return false; }

      membership.destroyRecord().then(() => {
        let message = `${user.get('name')} removed from ${role.get('name')} role`;
        this.sendAction('completedAction', message);
        // Ember Data relates users to roles (the membership relationship is inferred),
        // need to remove the user from the role's list of user
        role.get('users').then((users) => { users.removeObject(user.get('content')); });
        role.get('users').reload();
        return role.get('memberships').reload();
      });
    }
  }
});
