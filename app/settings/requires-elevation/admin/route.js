import Ember from 'ember';
import { getPersistedToken, revokeAllAccessibleTokens } from "diesel/utils/tokens";

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
      workingEmail: "",
      workingOtpConfiguration: user.get("currentOtpConfiguration"),
      otpToken: "",
      showOtpRecoveryCodes: false,
      showOtpSecret: false,
      user: user,
    });
  },

  promptForSessionLogout() {
    const m = 'Do you want to log out all other sessions? ' +
              '(if unsure, we recommend you do so by clicking OK)';
    if (!confirm(m)) { return; }
    return this.revokeAllAccessibleTokens();
  },

  revokeAllAccessibleTokens() {
    // This page is protected by elevation, so we might have two tokens: a
    // persisted one that's going to be used once we exit this page, and an
    // ephemeral elevated token that's in-use right now. We want to preserve
    // both of those.
    return Ember.RSVP.hash({
      persistedToken: getPersistedToken(),
      sessionToken: this.get("session.token.data.links.self")
    }).then((tokens) => {
      return revokeAllAccessibleTokens({
        exceptTokenHrefs: [
          tokens.persistedToken._links.self.href,
          tokens.sessionToken
        ]});
    }).then((response) => {
      const m = `Revoked ${response.revoked} token(s). ` +
        'It may take up to a minute for all sessions to effectively be logged out.';
      Ember.get(this, 'flashMessages').success(m);
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
      }).then(() => {
        return this.promptForSessionLogout();
      }).catch((e) => {
        this.handleApiError(e);
      });
    },

    changeEmail(){
      let user = this.currentModel.get("user");
      let newEmail = this.currentModel.get("workingEmail");

      if (newEmail === user.get("email")) {
        const msg = `${newEmail} is already your email address`;
        Ember.get(this, "flashMessages").warning(msg);
        return;
      }

      const challenge = this.store.createRecord("email-verification-challenge", {
        user: user,
        email: newEmail
      });

      this.controller.set("emailIsSaving", true);

      challenge.save().then((emailVerificationChallenge) => {
        const m = `A verification email has been sent to ${emailVerificationChallenge.get("email")}`;
        Ember.get(this, 'flashMessages').success(m);
      }, (e) => {
        challenge.rollback();
        throw e;
      }).catch((e) => {
        this.handleApiError(e);
      }).finally(() => {
        this.controller.set("emailIsSaving", false);
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
        return !otpWasEnabled;
      }).then((newOtpStatus) => {
        if (!newOtpStatus) { return; }
        return this.promptForSessionLogout();
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

    revokeAllAccessibleTokens() {
      // NOTE: This action technically does not require elevation in the API,
      // but the account page is the most natural place to put it.
      return this.revokeAllAccessibleTokens();
    },

    openEmailVerificationChallengesModal() {
      return this.currentModel.get("user.emailVerificationChallenges").then((r) => {
        this.controller.set("emailVerificationChallenges", r);
      });
    },

    revokeEmailVerificationChallenge(challenge) {
      const challengeEmail = challenge.get("email");
      challenge.destroyRecord().then(() => {
        const m = `Revoked email verification for ${challengeEmail}`;
        Ember.get(this, 'flashMessages').success(m);
      });
    },

    willTransition() {
      return this.clearCredentials();
    }
  }
});
