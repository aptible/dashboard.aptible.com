import Ember from 'ember';
import Location from 'diesel/utils/location';
import { revokeAllAccessibleTokens } from "diesel/utils/tokens";

export default Ember.Route.extend({
  model() {
    return Ember.Object.create({
      revokeAllAccessible: false,
      inProgress: false
    });
  },

  setupController(controller, model) {
    controller.set("model", model);
  },

  actions: {
    doLogout() {
      this.currentModel.set("inProgress", true);

      let logoutPromise;
      if (this.currentModel.get("revokeAllAccessible")) {
        logoutPromise = revokeAllAccessibleTokens().then(() => {
          return this.session.close('application', { noDelete: true });
        });
      } else {
        logoutPromise = this.session.close('application', {
          token: this.get('session.token')
        }).catch((e) => {
          if (e.responseJSON && e.responseJSON.error === 'expired_token') {
            // If the user's token has expired, then we don't care to log them
            // out "further".
            return;
          }
          throw e;
        });
      }

      return logoutPromise.then(() => {
        return Location.replaceAndWait("/");
      }).catch((e) => {
        let message = e.responseJSON ? e.responseJSON.message : e.message;
        message = message || 'An unexpected error occurred.';
        Ember.get(this, 'flashMessages').danger(message);
      }).finally(() => {
        this.currentModel.set("inProgress", false);
      });
    }
  }
});
