import DS from 'ember-data';
import Ember from 'ember';
import { formatUtcTimestamp } from '../helpers/format-utc-timestamp';

const FINGERPRINT_DISPLAY_SIZE = 7;

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
  isAcme: DS.attr('boolean'),
  sha256Fingerprint: DS.attr('string'),

  // relationships
  stack: DS.belongsTo('stack', {async: true}),
  operations: DS.hasMany('operation', {async:true}),
  vhosts: DS.hasMany('vhost', {async:true}),
  apps: DS.hasMany('app', {async:true}),

  inUse: Ember.computed.gt('vhosts.length', 0),

  name: Ember.computed('commonName', 'notBefore', 'notAfter', 'issuerDisplayName', 'shortDisplayFingerprint', function() {
    const bits = [this.get("commonName")];

    const notBefore = this.get('notBefore');
    const notAfter = this.get('notAfter');
    if (notBefore && notAfter) {
      bits.push(`Valid: ${formatUtcTimestamp(notBefore, true)} - ${formatUtcTimestamp(notAfter, true)}`);
    }

    const issuerDisplayName = this.get("issuerDisplayName");
    if (issuerDisplayName) {
      bits.push(issuerDisplayName);
    }

    const fingerprint = this.get("shortDisplayFingerprint");
    if (fingerprint) {
      bits.push(fingerprint);
    }

    return bits.join(" - ");
  }),

  issuerDisplayName: Ember.computed("issuerOrganization", "issuerCommonName", function() {
    return this.get("issuerOrganization") || this.get("issuerCommonName");
  }),

  shortDisplayFingerprint: Ember.computed("sha256Fingerprint", function() {
    const fingerprint = this.get("sha256Fingerprint");
    return fingerprint && fingerprint.slice(0, FINGERPRINT_DISPLAY_SIZE);
  })
});
