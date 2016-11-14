import DS from 'ember-data';

export default DS.Model.extend({
  challengeId: DS.attr('string'),
  verificationCode: DS.attr('string'),
  invitationId: DS.attr('string'),
  type: DS.attr('string'),
  userId: DS.attr('string'),
  password: DS.attr('string'),


  // TODO(PasswordResetChallenge): Remove
  resetCode: DS.attr('string')
});
