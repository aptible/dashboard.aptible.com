import Ember from 'ember';

export default Ember.Controller.extend({
  gridironSetup: Ember.inject.controller(),
  showInviteModal() {
    this.get('gridironSetup').set('showInviteModal', true);
  },

  actions: {
    openInviteModal(role) {
      this.get('gridironSetup').set('addUsersToRole', role);
    }
  }
});
