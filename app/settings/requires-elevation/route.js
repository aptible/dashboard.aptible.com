import Ember from 'ember';

export default Ember.Route.extend({
  elevation: Ember.inject.service(),

  beforeModel(transition) {
    let elevationService = this.get("elevation");
    if (!elevationService.isElevated()) {
      this.transitionTo("elevate", {queryParams: { redirectTo: transition.targetName }});
    }
  }
});
