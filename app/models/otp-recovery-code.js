import DS from 'ember-data';

export default DS.Model.extend({
  otpConfiguration: DS.belongsTo('otp-configuration', { async:true }),
  value: DS.attr('string'),
  used: DS.attr('boolean'),
});
