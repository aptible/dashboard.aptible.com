import Ember from "ember";
import { executeAuthAttempt } from "diesel/login/route";

export default Ember.Route.extend({
  elevation: Ember.inject.service(),

  model() {
    let user = this.session.get('currentUser');

    let model = Ember.Object.create({
      email: user.get("email"),
      password: '',
      otpRequested: false,
      isLoggingIn: false
    });

    return model;
  },

  actions: {
    login() {
      let route = this;
      let elevationService = route.get("elevation");

      let authPromiseFactory = function(credentials) {
        return elevationService.createElevatedToken(credentials).then(() => {
          if (elevationService.attemptedTransition) {
            elevationService.attemptedTransition.retry();
            elevationService.attemptedTransition = null;
          } else {
            route.transitionTo('index');
          }
        });
      };

      return executeAuthAttempt.bind(this, authPromiseFactory)();
    }
  }
});
