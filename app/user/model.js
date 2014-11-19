import DS from "ember-data";

export default DS.Model.extend({
  token: DS.belongsTo('token', {async: true}),
  email: DS.attr('string'),
  name: DS.attr('string'),
  username: DS.attr('string'),
  verified: DS.attr('boolean')
});
