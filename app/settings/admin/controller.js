import Ember from 'ember';

var and = Ember.computed.and;

var OTP_STATE_DISABLED = 1;
var OTP_STATE_PENDING = 2;
var OTP_STATE_ENABLED = 3;

export default Ember.Controller.extend({
  changingPassword: false,
  changingEmail: false,
  passwordError: null,
  emailError: null,
  otpMessage: null,
  otpMessageLevel: null,

  isSavingPassword: and('changingPassword',
                        'session.currentUser.isSaving'),
  isSavingEmail: and('changingEmail',
                     'session.currentUser.isSaving'),

  otpState: Ember.computed("model.otpEnabled", "model.otpUri", function() {
    let otpEnabled = this.get("model.otpEnabled");
    let otpUri = this.get("model.otpUri");
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
        return 'Activate 2FA';
      case OTP_STATE_ENABLED:
        return 'Deactivate 2FA';
      default:
        throw new Error(`Unexpected OTP State: ${otpState}`);
    }
  }),

  otpDisabled: Ember.computed.equal("otpState", OTP_STATE_DISABLED),
  otpPending: Ember.computed.equal("otpState", OTP_STATE_PENDING),
  otpEnabled: Ember.computed.equal("otpState", OTP_STATE_ENABLED),

  otpShowToken: Ember.computed.or("otpEnabled", "otpPending")
});
