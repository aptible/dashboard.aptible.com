import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  dockerRepo: DS.attr('string'),
  description: DS.attr('string'),
  type: DS.attr('string'), // postgresql, redis, etc.
  default: DS.attr('boolean'),
  visible: DS.attr('boolean')
});
