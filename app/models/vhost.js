import DS from 'ember-data';

export default DS.Model.extend({
  virtualDomain: DS.attr('string'),
  status: DS.attr('string'),
  externalHost: DS.attr('string'),
  service: DS.belongsTo('service', {async:true})
});
