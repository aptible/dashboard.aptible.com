import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['aptable__member-row'],
  tagName: 'tr',

  isDisabled: Ember.computed('currentUser.roles.[]', 'currentUser.memberships.[]', function() {
    // let role = this.get('role');
    // let organization = role.get('organization');
    // return true;
  }),

  actions: {
    togglePrivileged() {
      this.get('membership').save();
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
