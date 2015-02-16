import DS from 'ember-data';

export default DS.Model.extend({
  app: DS.belongsTo('app', {async:true})
});
