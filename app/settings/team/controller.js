import Ember from 'ember';
import TeamController from 'sheriff/setup/team/controller';

export default TeamController.extend({
  settings: Ember.inject.controller(),
  showInviteModal() {
    this.get('settings').set('showInviteModal', true);
  }
});