import Ember from 'ember';

let clearCredentials = function(user) {
  if (user.get('isDeleted')) {
    // In test, the user will (most likely) be deleted before the route is
    // destroyed.
    return;
  }

  // TODO this will leave the user in a dirty state.
  user.set("password", null);
  user.set("passwordConfirmation", null);
  user.set("otpToken", null);
  user.get("currentOtpConfiguration").set("otpUri", null);
};

export default Ember.Route.extend({
  model() {
    return this.session.get('currentUser');
  },

  resetController(controller){
    controller.setProperties({
      showOtpRecoveryCodes: true,
    });
  },

  handleApiError(e) {
    let message = e.responseJSON ? e.responseJSON.message : e.message;
    message = message || 'An unexpected error occurred.';
    Ember.get(this, 'flashMessages').danger(message);
  },

  actions: {
    changePassword() {
      let user = this.currentModel;

      if (user.get("password") !== user.get("passwordConfirmation")) {
        Ember.get(this, 'flashMessages').danger("Passwords don't match.");
        return;
      }

      user.save().then(() => {
        clearCredentials(user);
        Ember.get(this, 'flashMessages').success('Password updated');
      }).catch((e) => {
        this.handleApiError(e);
      });
    },

    changeEmail(){
      let user = this.currentModel;
      user.save().then(() => {
        Ember.get(this, 'flashMessages').success(`Email updated to ${user.get('email')}`);
      }).catch( (e) => {
        this.handleApiError(e);
      });
    },

    resetOtp() {
      let user = this.currentModel;

      this.store.createRecord('otp-configuration', {
        user: user
      }).save().then((otpConfiguration) => {
        // Add the OTP configuration on the user, but don't save it just yet.
        // It'll be saved if we make another request, with the OTP token.
        user.set("currentOtpConfiguration", otpConfiguration);
        Ember.get(this, 'flashMessages').success("Scan the QR code to proceed.");
      }).catch((e) => {
        this.handleApiError(e);
      });
    },

    toggleOtp() {
      let user = this.currentModel;
      let otpWasEnabled = user.get("otpEnabled");

      user.set("otpEnabled", !otpWasEnabled).save().then(() => {
        clearCredentials(user);
        Ember.get(this, 'flashMessages').success(`2FA is now ${otpWasEnabled ? 'disabled' : 'enabled'}.`);
      }).catch((e) => {
        this.handleApiError(e);
        user.set("otpEnabled", otpWasEnabled);
      });
    },

    showOtpRecoveryCodes() {
      this.controller.set("showOtpRecoveryCodes", true);
    },

    willTransition() {
      return clearCredentials(this.currentModel);
    }
  }
});
