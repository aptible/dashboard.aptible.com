import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  status: DS.attr('string'),
  approvingAuthorityUserName: DS.attr('string'),
  approvingAuthorityUserEmail:DS.attr('string'),
  approvingAuthorityUrl: DS.attr('string'),
  vulnerabilities: DS.hasMany('vulnerability', {embedded: true}),
  threatEvents: DS.hasMany('threatEvent', {embedded: true}),
  predisposingConditions: DS.hasMany('predisposingCondition', {embedded: true}),
  threatSources: DS.hasMany('threatSource', {embedded: true}),
  securityControls: DS.hasMany('securityControl', {embedded: true}),
  mitigations: DS.hasMany('mitigation', {embedded: true})
});
