import DS from 'ember-data';

export default DS.Model.extend({
  type: DS.attr('string'),
  status: DS.attr('string', {defaultValue: 'queued'}),
  createdAt: DS.attr('iso-8601-timestamp'),
  userName: DS.attr('string'),
  userEmail: DS.attr('string'),
  gitRef: DS.attr('string'),

  // provisioning databases
  diskSize: DS.attr('number'),

  // scaling services
  containerCount: DS.attr('number'), // when scaling a service

  // vhosts
  certificate: DS.attr(),
  privateKey: DS.attr(),

  // append these values for a nested url. They are
  // not actual attributes in the server payload, and
  // as such not ember-data `attrs`.
  database: null,
  app: null,
  vhost: null,
  logDrain: null,
  service: null
});
