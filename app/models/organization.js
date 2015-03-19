import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  primaryPhone: DS.attr('string'),
  emergencyPhone: DS.attr('string'),
  city: DS.attr('string'),
  state: DS.attr('string'),
  zip: DS.attr('string'),
  address: DS.attr('string'),
  plan: DS.attr('string'),

  users: DS.hasMany('users', {async: true})
});
