import Ember from 'ember';

// Adapted from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
const extractParameterFromUri = function(name, url) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  var results = regex.exec(url);
  if (!results) { return null; }
  if (!results[2]) { return '';  }
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

const OTP_STATE_DISABLED = 1;
const OTP_STATE_PENDING = 2;
const OTP_STATE_ENABLED = 3;

export default Ember.Controller.extend({
  userIsSaving: Ember.computed.bool('model.user.isSaving'),
  emailIsSaving: false,

  otpState: Ember.computed("model.user.otpEnabled", "model.workingOtpConfiguration.otpUri", function() {
    let otpEnabled = this.get("model.user.otpEnabled");
    let workingOtpUri  = this.get("model.workingOtpConfiguration.otpUri");
    if (otpEnabled) { return OTP_STATE_ENABLED; }
    if (workingOtpUri) { return OTP_STATE_PENDING; }
    return OTP_STATE_DISABLED;
  }),

  otpSecret: Ember.computed("model.workingOtpConfiguration.otpUri", function() {
    let workingOtpUri  = this.get("model.workingOtpConfiguration.otpUri");
    return extractParameterFromUri("secret", workingOtpUri);
  }),

  otpButtonAction: Ember.computed("otpState", function() {
    let otpState = this.get("otpState");

    switch(otpState) {
      case OTP_STATE_DISABLED:
        return 'resetOtp';
      case OTP_STATE_PENDING:
        return 'toggleOtp';
      case OTP_STATE_ENABLED:
        return 'toggleOtp';
      default:
        throw new Error(`Unexpected OTP State: ${otpState}`);
    }
  }),

  otpButtonLabel: Ember.computed("otpState", function() {
    let otpState = this.get("otpState");

    switch(otpState) {
      case OTP_STATE_DISABLED:
        return 'Configure 2FA';
      case OTP_STATE_PENDING:
        return 'Enable 2FA';
      case OTP_STATE_ENABLED:
        return 'Disable 2FA';
      default:
        throw new Error(`Unexpected OTP State: ${otpState}`);
    }
  }),

  otpDisabled: Ember.computed.equal("otpState", OTP_STATE_DISABLED),
  otpPending: Ember.computed.equal("otpState", OTP_STATE_PENDING),
  otpEnabled: Ember.computed.equal("otpState", OTP_STATE_ENABLED),

  usedRecoveryCodes: Ember.computed.filterBy("model.user.currentOtpConfiguration.otpRecoveryCodes", "used", true),
  allRecoveryCodes: Ember.computed.alias("model.user.currentOtpConfiguration.otpRecoveryCodes")
});
