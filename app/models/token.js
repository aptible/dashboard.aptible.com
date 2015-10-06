import DS from "ember-data";

export default DS.Model.extend({
  accessToken: DS.attr('string'),
  user: DS.belongsTo('user', { async: true, requireReload: true })
});
