import Ember from 'ember';

var OTP_STATE_DISABLED = 1;
var OTP_STATE_PENDING = 2;
var OTP_STATE_ENABLED = 3;

export default Ember.Controller.extend({
  isSaving: Ember.computed.bool('session.currentUser.isSaving'),

  otpState: Ember.computed("model.user.otpEnabled", "model.workingOtpConfiguration.otpUri", function() {
    let otpEnabled = this.get("model.user.otpEnabled");
    let workingOtpUri  = this.get("model.workingOtpConfiguration.otpUri");
    if (otpEnabled) { return OTP_STATE_ENABLED; }
    if (workingOtpUri) { return OTP_STATE_PENDING; }
    return OTP_STATE_DISABLED;
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
        return 'Start 2FA activation';
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
