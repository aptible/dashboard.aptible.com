import Ember from "ember";
import { executeAuthAttempt } from "diesel/login/route";

export default Ember.Route.extend({
  elevation: Ember.inject.service(),

  model(queryParams) {
    let model = Ember.Object.create({
      email: this.get("session.currentUser.email"),
      password: '',
      otpRequested: false,
      isLoggingIn: false,

      redirectTo: queryParams["redirectTo"]
    });

    return model;
  },

  actions: {
    login() {
      let route = this;
      let elevationService = route.get("elevation");

      let authPromiseFactory = function(credentials) {
        return elevationService.createElevatedToken(credentials).then(() => {
          let redirectTo = route.currentModel.get("redirectTo") || "index";
          route.transitionTo(redirectTo);
        });
      };

      return executeAuthAttempt.bind(this, authPromiseFactory)();
    }
  }
});
