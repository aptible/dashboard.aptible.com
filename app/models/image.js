import DS from 'ember-data';

export default DS.Model.extend({
  gitRef: DS.attr('string'),
  app: DS.belongsTo('app', {async:true})
});
