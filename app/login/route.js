import Ember from "ember";
import Cookies from "diesel/utils/cookies";
import Location from "../utils/location";
import DisallowAuthenticated from "diesel/mixins/routes/disallow-authenticated";

export const AFTER_AUTH_COOKIE = 'afterAuthUrl';

export function buildCredentials(email, password, otpToken) {
  let credentials = {
    username: email,
    password,
    grant_type: 'password',
    scope: 'manage',
    expires_in: 12 * 60 * 60  // 12 hours
  };

  if (!Ember.isNone(otpToken)) {
    credentials.otp_token = otpToken;
  }

  return credentials;
}

export function executeAuthAttempt(authPromiseFactory) {
  let credentials = buildCredentials(this.currentModel.get('email'),
      this.currentModel.get('password'),
      this.currentModel.get('otpToken'));

  this.currentModel.set('isLoggingIn', true);
  this.currentModel.set('error', null);

  return authPromiseFactory(credentials).catch((e) => {
    if (e.authError === 'otp_token_required') {
      this.currentModel.set('otpRequested', true);
    } else {
      this.currentModel.set('error', e.message);
    }
  }) .finally(() => {
    this.currentModel.set('isLoggingIn', false);
  });
}

export default Ember.Route.extend(DisallowAuthenticated, {
  model() {
    var model = Ember.Object.create({
      email: '',
      password: '',
      otpRequested: false,
      isLoggingIn: false
    });

    var afterAuthUrl = Cookies.read(AFTER_AUTH_COOKIE);
    if (afterAuthUrl) {
      Cookies.erase(AFTER_AUTH_COOKIE);
      model.set('afterAuthUrl', afterAuthUrl);
    }
    return model;
  },

  redirect(){
    if (this.session.get('isAuthenticated')) {
      this.transitionTo('requires-authorization');
    }
  },

  actions: {
    login() {
      let route = this;

      let authPromiseFactory = function(credentials) {
        return route.session.open('application', credentials).then(() => {
          if (route.session.attemptedTransition) {
            route.session.attemptedTransition.retry();
            route.session.attemptedTransition = null;
          } else if (route.currentModel.get('afterAuthUrl')) {
            Location.replace(route.currentModel.get('afterAuthUrl'));
          } else {
            route.currentModel.set('isSuccessful', true);  // TODO: Is this used anywhere?
            route.transitionTo('requires-authorization');
          }
        });
      };

      return executeAuthAttempt.bind(this, authPromiseFactory)();
    }
  }
});
