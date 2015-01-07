import DS from 'ember-data';

export default DS.Model.extend({
  verificationCode: DS.attr('string'),
  type: DS.attr('string')
});
