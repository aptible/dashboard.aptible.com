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
          let redirectTo = route.currentModel.get("redirectTo") || "enclave";

          // redirectTo is persisted in the URL, which makes this page work
          // after a reload. However, it means it can be spoofed by sending
          // someone to this page with a invalid redirectTo. However unlikely,
          // this could hypothetically be exploited to facilitate a social
          // engineering attack. So, if we get a route not found error, let's
          // replace it with a more generic one.
          try {
            route.transitionTo(redirectTo);
          } catch(transitionError) {
            if (transitionError.message.match(/route[^]+not found/)) {
              const newError = new Error("Route not found.");
              newError.originalError = transitionError;
              throw newError;
            }
            throw transitionError;
          }
        });
      };

      return executeAuthAttempt.bind(this, authPromiseFactory)();
    }
  }
});
