import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  // properties
  name: DS.attr('string'),
  handle: DS.attr('string'),
  number: DS.attr('string'),
  type: DS.attr('string'),
  syslogHost: DS.attr('string'),
  syslogPort: DS.attr('string'),

  // relationships
  apps: DS.hasMany('app', {async: true}),
  databases: DS.hasMany('database', {async: true}),
  permissions: DS.hasMany('permission', {async:true}),
  organization: DS.belongsTo('organization', {async:true}),
  logDrains: DS.hasMany('log-drain', {async:true}),

  // computed properties
  allowPHI: Ember.computed.match('type', /production|platform|pilot/),
  appContainerCentsPerHour: function() {
    return this.get('allowPHI') ? 10 : 6;
  }.property('allowPHI')
});
