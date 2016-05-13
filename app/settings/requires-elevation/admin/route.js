import Ember from 'ember';

const clearPassword = function(user) {
  user.set("password", null);
};

const clearOtp = function(user) {
  user.set("otpToken", null);
  user.get("currentOtpConfiguration").then((otpConfiguration) => {
    if (otpConfiguration) {
      otpConfiguration.set("otpUri", null);
    }
  });
};

export default Ember.Route.extend({
  model() {
    let user = this.session.get("currentUser");

    return Ember.Object.create({
      workingPassword: "",
      workingPasswordConfirmation: "",
      workingEmail: user.get("email"),
      workingOtpConfiguration: user.get("currentOtpConfiguration"),
      otpToken: "",
      showOtpRecoveryCodes: false,
      showOtpSecret: false,
      user: user,
    });
  },

  handleApiError(e) {
    let message = e.responseJSON ? e.responseJSON.message : e.message;
    message = message || 'An unexpected error occurred.';
    Ember.get(this, 'flashMessages').danger(message);
  },

  clearCredentials() {
    let user = this.currentModel.get("user");

    if (user.get('isDeleted')) {
      // In test, the user will (most likely) be deleted before the route is
      // destroyed.
      return;
    }

    // TODO this will leave the user in a dirty state.
    clearPassword(user);
    clearOtp(user);
  },

  actions: {
    changePassword() {
      let user = this.currentModel.get("user");
      let newPassword = this.currentModel.get("workingPassword");
      let newPasswordConfirmation = this.currentModel.get("workingPasswordConfirmation");

      if (!newPassword) {
        Ember.get(this, 'flashMessages').danger("Password can't be empty.");
        return;
      }

      if (newPassword !== newPasswordConfirmation) {
        Ember.get(this, 'flashMessages').danger("Passwords don't match.");
        return;
      }

      user.set("password", newPassword).save().then(() => {
        this.currentModel.set("workingPassword", "");
        this.currentModel.set("workingPasswordConfirmation", "");
        clearPassword(user);
        Ember.get(this, 'flashMessages').success('Password updated');
      }).catch((e) => {
        this.handleApiError(e);
      });
    },

    changeEmail(){
      let user = this.currentModel.get("user");
      let newEmail = this.currentModel.get("workingEmail");

      user.set("email", newEmail).save().then(() => {
        Ember.get(this, 'flashMessages').success(`Email updated to ${user.get('email')}`);
      }).catch( (e) => {
        this.handleApiError(e);
      });
    },

    resetOtp() {
      let user = this.currentModel.get("user");

      this.store.createRecord('otp-configuration', {
        user: user
      }).save().then((otpConfiguration) => {
        // Add the OTP configuration on the user, but don't save it just yet.
        // It'll be saved if we make another request, with the OTP token.
        this.currentModel.set("workingOtpConfiguration", otpConfiguration);
        Ember.get(this, 'flashMessages').success("Scan the QR code to proceed.");
      }).catch((e) => {
        this.handleApiError(e);
      });
    },

    toggleOtp() {
      let user = this.currentModel.get("user");
      let otpWasEnabled = user.get("otpEnabled");

      user.setProperties({
        otpEnabled: !otpWasEnabled,
        otpToken: this.currentModel.get("otpToken"),
        currentOtpConfiguration: this.currentModel.get("workingOtpConfiguration")
      }).save().then(() => {
        clearOtp(user);
        this.currentModel.setProperties({
          otpToken: null,
          showOtpRecoveryCodes: false,
          showOtpSecret: false
        });
        Ember.get(this, 'flashMessages').success(`2FA is now ${otpWasEnabled ? 'disabled' : 'enabled'}.`);
      }).catch((e) => {
        this.handleApiError(e);
        user.set("otpEnabled", otpWasEnabled);
      });
    },

    showOtpSecret() {
      this.currentModel.set("showOtpSecret", true);
    },

    showOtpRecoveryCodes() {
      this.currentModel.set("showOtpRecoveryCodes", true);
    },

    willTransition() {
      return this.clearCredentials();
    }
  }
});
