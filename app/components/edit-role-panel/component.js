import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['panel', 'white-panel', 'workforce-role'],
  invitedUser: null,

  roleInvitations: Ember.computed('invitations.[]', function() {
    if(this.get('role.isNew')) {
      return [];
    }
    return this.get('invitations').filterBy('role.id', this.get('role.id'));
  }),

  showUsers: Ember.computed('roleInvitations', 'role.users.[]', function() {
    return this.get('roleInvitations.length') + this.get('role.users.length') > 0;
  }),

  nonMembers: Ember.computed('role.users.[]', 'role.organization.users.[]', function() {
    const members = this.get('role.users');
    const organizationUsers = this.get('role.organization.users');

    return organizationUsers.reject(user => members.contains(user));
  }),

  disableAddExistingButton: Ember.computed.not('invitedUser'),

  actions: {
    addMember(user) {
      this.sendAction('addMember', user, this.get('role'));
    },

    removeMember(membership) {
      this.sendAction('removeMember', membership, this.get('role'));
    },

    openInviteModal() {
      this.sendAction("openInviteModal", this.get('role'));
    },

    deleteInvitation(invitation) {
      this.sendAction('deleteInvitation', invitation);
    },

    resendInvitation(invitation) {
      this.sendAction('resendInvitation', invitation);
    },
  }
});
