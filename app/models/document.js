import DS from 'ember-data';

export default DS.Model.extend({
  createdAt: DS.attr('iso-8601-timestamp'),
  expiresAt: DS.attr('iso-8601-timestamp'),
  organizationUrl: DS.attr('string'),
  userUrl: DS.attr('string'),
  appUrl: DS.attr('string'),
  printVersionUrl: DS.attr('string'),
  criterion: DS.belongsTo('criterion', { async: true })
});
