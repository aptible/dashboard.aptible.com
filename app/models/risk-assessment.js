import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  status: DS.attr('string'),
  approvingAuthorityUserName: DS.attr('string'),
  approvingAuthorityUserEmail:DS.attr('string'),
  approvingAuthorityUrl: DS.attr('string'),
  vulnerabilities: DS.hasMany('vulnerability', {embedded: true}),
  threatEvents: DS.hasMany('threat-event', {embedded: true}),
  predisposingConditions: DS.hasMany('predisposing-condition', {embedded: true}),
  threatSources: DS.hasMany('threat-source', {embedded: true}),
  securityControls: DS.hasMany('security-control', {embedded: true}),
  mitigations: DS.hasMany('mitigation', {embedded: true}),
  createdAt: DS.attr('iso-8601-timestamp'),

  organizationProfile: DS.belongsTo('organization-profile', { async: true }),

  isDraft: Ember.computed.equal('status', 'draft'),
  isCurrent: Ember.computed.equal('status', 'current'),
  isArchived: Ember.computed.equal('status', 'archive')
});
