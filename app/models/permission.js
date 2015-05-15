import DS from 'ember-data';

export default DS.Model.extend({
  scope: DS.attr(),
  role: DS.attr(),
  stack: DS.belongsTo('stack', {async:true})
});
