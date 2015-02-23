import DS from 'ember-data';

export default DS.Model.extend({
  size: DS.attr('number'),

  database: DS.belongsTo('database', {async:true})
});
