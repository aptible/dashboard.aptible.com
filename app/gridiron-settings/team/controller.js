import Ember from 'ember';

export default Ember.Controller.extend({
  settings: Ember.inject.controller('gridiron-settings'),

  showInviteModal() {
    this.get('settings').set('showInviteModal', true);
  },

  actions: {
    openInviteModal(role) {
      this.get('settings').set('addUsersToRole', role);
    }
  }
});