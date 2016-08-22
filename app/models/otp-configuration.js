import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user', { async: true, inverse: 'otpConfigurations' }),
  otpUri: DS.attr('string'),
  otpRecoveryCodes: DS.hasMany('otp-recovery-code', { async: true })
});
