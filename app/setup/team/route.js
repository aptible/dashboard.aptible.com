import SPDRouteMixin from 'diesel/mixins/routes/spd-route';
import SettingsTeamRoute from 'diesel/compliance-settings/team/route';

export default SettingsTeamRoute.extend(SPDRouteMixin, {
  actions: {
    onNext() {
     let profile = this.modelFor('setup');
      profile.next(this.get('stepName'));
      return profile.save().then(() => {
        this.transitionTo(`setup.${profile.get('currentStep')}`);
      });
    }
  }
});
