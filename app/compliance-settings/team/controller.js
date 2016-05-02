import Ember from 'ember';
import TeamController from 'diesel/setup/team/controller';

export default TeamController.extend({
  settings: Ember.inject.controller('compliance-settings'),
  showInviteModal() {
    this.get('settings').set('showInviteModal', true);
  }
});