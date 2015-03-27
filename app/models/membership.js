import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.attr(), // is a URL
  role: DS.belongsTo('role', {async: true})
});
