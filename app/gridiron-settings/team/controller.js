import Ember from 'ember';

export default Ember.Controller.extend({
  gridironSettings: Ember.inject.controller(),

  showInviteModal() {
    this.get('gridironSettings').set('showInviteModal', true);
  },

  actions: {
    openInviteModal(role) {
      this.get('gridironSettings').set('addUsersToRole', role);
    }
  }
});