import DS from 'ember-data';

export default DS.Model.extend({
  type: DS.attr('string'), // 'verification_code' || 'invitation'

  // required for saving a new invitation reset:
  invitationId: DS.attr('string')
});
