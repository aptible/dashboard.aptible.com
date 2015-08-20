import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  // properties
  certificateBody: DS.attr('string'),
  privateKey: DS.attr('string'),
  commonName: DS.attr('string'),
  issuerCountry: DS.attr('string'),
  issuerOrganization: DS.attr('string'),
  issuerWebsite: DS.attr('string'),
  issuerCommonName: DS.attr('string'),
  subjectCountry: DS.attr('string'),
  subjectState: DS.attr('string'),
  subjectLocale: DS.attr('string'),
  subjectOrganization: DS.attr('string'),
  createdAt: DS.attr('iso-8601-timestamp'),
  notBefore: DS.attr('iso-8601-timestamp'),
  notAfter: DS.attr('iso-8601-timestamp'),

  // relationships
  stack: DS.belongsTo('stack', {async: true}),
  operations: DS.hasMany('operation', {async:true}),
  vhosts: DS.hasMany('vhost', {async:true}),
  apps: DS.hasMany('app', {asyn:true}),

  inUse: Ember.computed.gt('vhosts.length', 0),
  name: Ember.computed.reads('commonName')
});
