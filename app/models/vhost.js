import DS from 'ember-data';

export default DS.Model.extend({
  virtualDomain: DS.attr('string'),
  status: DS.attr('string'),
  externalHost: DS.attr('string'),
  privateKey: DS.attr('string'),
  certificate: DS.attr('string'),
  type: DS.attr('string', {defaultValue:'http'}),
  isDefault: DS.attr('boolean'),
  service: DS.belongsTo('service', {async:true})
});
