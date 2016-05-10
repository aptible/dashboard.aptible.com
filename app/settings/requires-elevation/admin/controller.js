import Ember from 'ember';

var OTP_STATE_DISABLED = 1;
var OTP_STATE_PENDING = 2;
var OTP_STATE_ENABLED = 3;

export default Ember.Controller.extend({
  isSavingPassword: Ember.computed.bool('session.currentUser.isSaving'),
  isSavingEmail: Ember.computed.bool('session.currentUser.isSaving'),

  otpState: Ember.computed("model.otpEnabled", "model.currentOtpConfiguration.otpUri", function() {
    let otpEnabled = this.get("model.otpEnabled");
    let otpUri = this.get("model.currentOtpConfiguration.otpUri");
    if (otpEnabled) { return OTP_STATE_ENABLED; }
    if (otpUri) { return OTP_STATE_PENDING; }
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
  otpEnabled: Ember.computed.equal("otpState", OTP_STATE_ENABLED)
});
