import DS from 'ember-data';

export default DS.Model.extend({
  type: DS.attr('string'),
  status: DS.attr('string', {defaultValue: 'queued'}),
  createdAt: DS.attr('iso-8601-timestamp'),
  userName: DS.attr('string'),
  userEmail: DS.attr('string'),
  diskSize: DS.attr('number'),
  gitRef: DS.attr('string'),

  // append these values for a nested url. They are
  // not actual attributes in the server payload, and
  // as such not ember-data `attrs`.
  database: null,
  app: null,
  vhost: null
});
