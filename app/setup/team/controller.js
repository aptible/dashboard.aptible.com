import Ember from 'ember';

export default Ember.Controller.extend({
  setup: Ember.inject.controller(),
  showInviteModal() {
    this.get('setup').set('showInviteModal', true);
  },

  actions: {
    openInviteModal(role) {
      this.get('setup').set('addUsersToRole', role);
    }
  }
});
