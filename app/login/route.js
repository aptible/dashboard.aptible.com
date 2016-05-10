import Ember from "ember";
import Cookies from "ember-cli-aptible-shared/utils/cookies";
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

export default Ember.Route.extend(DisallowAuthenticated, {

  model: function() {
    var model = Ember.Object.create({
      email: '',
      password: ''
    });
    var afterAuthUrl = Cookies.read(AFTER_AUTH_COOKIE);
    if (afterAuthUrl) {
      Cookies.erase(AFTER_AUTH_COOKIE);
      model.set('afterAuthUrl', afterAuthUrl);
    }
    return model;
  },

  redirect: function(){
    if (this.session.get('isAuthenticated')) {
      this.transitionTo('index');
    }
  },

  actions: {

    login: function(authAttempt){
      var credentials = buildCredentials(authAttempt.get('email'),
                                         authAttempt.get('password'),
                                         authAttempt.get('otpToken'));

      this.controller.set('isLoggingIn', true);

      this.session.open('application', credentials).then(() => {
        if (this.session.attemptedTransition) {
          this.session.attemptedTransition.retry();
          this.session.attemptedTransition = null;
        } else if (authAttempt.get('afterAuthUrl')) {
          Location.replace(authAttempt.get('afterAuthUrl'));
        } else {
          this.controller.set('isSuccessful', true);
          this.transitionTo('index');
        }
      }, (e) => {
        if (e.authError === 'otp_token_required') {
          this.controller.set('otpRequested', true);
        } else {
          this.currentModel.set('error', e.message);
        }
      }).finally( () => {
        this.controller.set('isLoggingIn', false);
      });
    }
  }
});
