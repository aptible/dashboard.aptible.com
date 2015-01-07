import DS from 'ember-data';

export default DS.Model.extend({
  type: DS.attr('string'),
  status: DS.attr('string', {defaultValue: 'queued'}),
  createdAt: DS.attr('string'),
  userName: DS.attr('string'),
  userEmail: DS.attr('string'),
  diskSize: DS.attr('number')
});
