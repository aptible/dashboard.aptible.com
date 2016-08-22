import AuthAdapter from './auth';
import Ember from 'ember';
const pluralize = Ember.String.pluralize;
const decamelize = Ember.String.decamelize;
const underscore = Ember.String.underscore;

export default AuthAdapter.extend({
  // In URLs and JSON payloads, use "otp_recovery_codes" instead of "otpRecoveryCodes"
  pathForType: function(type){
    return underscore(pluralize(decamelize(type)));
  }
});
