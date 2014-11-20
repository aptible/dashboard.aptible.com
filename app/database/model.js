import DS from 'ember-data';

export default DS.Model.extend({
  stack: DS.belongsTo('stack', {async: true})
});
