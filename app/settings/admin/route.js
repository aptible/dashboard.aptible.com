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
  user.set("currentPassword", null);
  user.set("otpToken", null);
  user.set("otpUri", null);
};

export default Ember.Route.extend({
  model(){
    return this.session.get('currentUser');
  },

  resetController(controller){
    controller.setProperties({
      changingEmail: false,
      changingPassword: false
    });
  },

  actions: {
    resetOtp() {
      let controller = this.controller;
      let user = this.currentModel;

      controller.set("otpMessageLevel", null);
      user.set("otpReset", true).save().then(() => {
        controller.set("otpMessage", "Scan the QR code below to proceed.");
        controller.set("otpMessageLevel", "success");
      }).catch((e) => {
        let message = e.responseJSON ? e.responseJSON.message : e.message;
        controller.set("otpMessage", `Error: ${message}.`);
        controller.set("otpMessageLevel", "danger");
      }).finally(() => user.set("otpReset", false));
    },

    toggleOtp() {
      let controller = this.controller;
      let user = this.currentModel;
      let otpWasEnabled = user.get("otpEnabled");

      controller.set("otpMessageLevel", null);
      user.set("otpEnabled", !otpWasEnabled).save().then(() => {
        clearCredentials(user);
        controller.set("otpMessage", `2FA is now ${otpWasEnabled ? 'disabled' : 'enabled'}.`);
        controller.set("otpMessageLevel", "success");
      }).catch((e) => {
        let message = e.responseJSON ? e.responseJSON.message : e.message;
        controller.set("otpMessage", `Error: ${message}.`);
        controller.set("otpMessageLevel", "danger");
        user.set("otpEnabled", otpWasEnabled);
      });
    },

    changePassword(){
      var controller = this.controller;

      // Changing password is a 2-step process. We show the
      // "enter current password" input after clicking the button once
      if (!controller.get('changingPassword')) {
        controller.set('changingPassword', true);
        return;
      }

      var user = this.currentModel;

      // TODO: Do we actually care about new password confirmation in API??
      user.save().then(() => {
        controller.set('changingPassword', false);
        clearCredentials(user);
        Ember.get(this, 'flashMessages').success('Password updated');
      }).catch((e) => {
        let message = e.responseJSON ? e.responseJSON.message : e.message;
        message = message || 'There was an unexpected error updating password';
        Ember.get(this, 'flashMessages').danger(message);
      });
    },

    changeEmail(){
      // Changing email is a 2-step process. We show the
      // "enter current password" input after clicking the button once
      if (!this.controller.get('changingEmail')) {
        this.controller.set('changingEmail', true);
        return;
      }

      let user = this.currentModel;

      user.save().then(() => {
        this.controller.set('changingEmail', false);
        clearCredentials(user);
        Ember.get(this, 'flashMessages').success(`Email updated to ${user.get('email')}`);
      }).catch( (e) => {
        let message = e.responseJSON ? e.responseJSON.message : e.message;
        message = message || 'There was an unexpected error updating email';
        Ember.get(this, 'flashMessages').danger(message);
      });
    }
  },

  deactivate() {
    clearCredentials(this.currentModel);
    this.controller.set("otpMessageLevel", null);  // TODO: this is a little hackish.
  }
});
