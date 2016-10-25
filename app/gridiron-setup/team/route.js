import SPDRouteMixin from 'diesel/mixins/routes/spd-route';
import SettingsTeamRoute from 'diesel/gridiron-settings/team/route';

export default SettingsTeamRoute.extend(SPDRouteMixin, {
  actions: {
    onNext() {
     let profile = this.modelFor('gridiron-setup');
      profile.next(this.get('stepName'));
      return profile.save().then(() => {
        this.transitionTo(`gridiron-setup.${profile.get('currentStep')}`);
      });
    }
  }
});
