import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  handle: DS.attr('string'),
  number: DS.attr('string'),
  type: DS.attr('string'),
  syslogHost: DS.attr('string'),
  syslogPort: DS.attr('string'),

  apps: DS.hasMany('apps', {async: true}),
  databases: DS.hasMany('databases', {async: true}),
  permissions: DS.hasMany('permissions', {async:true}),

  allowPHI: Ember.computed.match('type', /production|platform|pilot/)
});
