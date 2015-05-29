import DS from 'ember-data';

export default DS.Model.extend({
  handle: DS.attr('string'),
  name: DS.attr('string'),
  description: DS.attr('string'),
  scope: DS.attr('string'),
  evidenceType: DS.attr('string'),
  documents: DS.hasMany('document', {async:true})
});
