import DS from 'ember-data';
import Ember from 'ember';

export const DEFAULT_DOCUMENT_EXPIRY_IN_YEARS = 1;

export default DS.Model.extend({
  app: DS.attr(),

  createdAt: DS.attr('iso-8601-timestamp'),
  expiresAt: DS.attr('iso-8601-timestamp'),
  organizationUrl: DS.attr('string'),
  userUrl: DS.attr('string'),
  appUrl: DS.attr('string'),
  printVersionUrl: DS.attr('string'),
  criterionId: DS.attr(),
  criterion: DS.belongsTo('criterion', { async: true }),

  isExpired: Ember.computed('expiresAt', 'createdAt', function() {
    let defaultExpiration = new Date(this.get('createdAt').getTime());
    defaultExpiration.setYear(defaultExpiration.getFullYear() + DEFAULT_DOCUMENT_EXPIRY_IN_YEARS);

    let expiresAt = this.get('expiresAt') || defaultExpiration;

    return new Date() > expiresAt;
  })
});
