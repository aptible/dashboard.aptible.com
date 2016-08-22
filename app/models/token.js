import DS from "ember-data";

export default DS.Model.extend({
  accessToken: DS.attr('string'),
  scope: DS.attr('string'),
  user: DS.belongsTo('user', { async: true, requireReload: true, inverse: 'tokens' }),
  actor: DS.belongsTo('user', { async: true, requireReload: true }),
  rawPayload: DS.attr('string')  // TODO: Probably don't need this anymore!
});
