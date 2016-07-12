import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['aptable__member-row'],
  tagName: 'tr',
  initialized: false,
  busy: false,

  setup: function() {
    Ember.run.next(() => {
      this.set('initialized', true);
    });
  }.on('init'),

  // Account | Platform | Compliance Owners effectively have admin privileges
  isToggled: Ember.computed('membersihp.privileged', 'membership.user.isOwner', function() {
    let membership = this.get('membership');
    return membership.get('user.isOwner') || membership.get('privileged');
  }),

  isDisabled: Ember.computed('currentUser.isOwner', function() {
    return this.get('currentUser.isOwner');
  }),

  actions: {
    togglePrivileged(isOn) {
      let membership = this.get('membership');

      if (!this.get('initialized') || this.get('busy')) { return; }
      if (membership.get('user.isOwner')) { return; }

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

      // Confirm...
      let confirmMsg = `\nAre you sure you want to remove ${user.get('name')} from ${role.get('name')}?\n`;
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
