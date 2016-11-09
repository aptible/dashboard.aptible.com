import DS from 'ember-data';
import Ember from 'ember';

function makeOperationPollSchedule(baseInterval, backoffFactor, timeout) {
  Ember.assert('baseInterval must be > 0', baseInterval > 0);
  Ember.assert('backoffFactor must be >= 1', backoffFactor >= 1);
  Ember.assert('timeout must be > 0', timeout > 0);

  const schedule = [];
  let total = 0;

  function pushInterval(interval) {
    total += interval;
    schedule.push(interval);
  }

  let nextInterval = baseInterval;
  while(total < timeout) {
    pushInterval(nextInterval);
    nextInterval = Math.floor(nextInterval * backoffFactor);
  }

  return schedule;
}

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
  containerSize: DS.attr('number'), // when scaling size of container
  containerCount: DS.attr('number'), // when scaling number of containers

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
  service: null,

  reloadUntilStatusChanged: function(timeout) {
    const operation = this;
    const schedule = makeOperationPollSchedule(4000, 1.2, timeout);

    return new Ember.RSVP.Promise((resolve, reject) => {
      const scheduleNextPoll = () => {
        operation.reload().then((o) => {
          const operationStatus = o.get("status");

          if (operationStatus === "succeeded") {
            return resolve(o);
          }

          if (operationStatus === "failed") {
            throw new Error('Operation failed');
          }

          const nextInterval = schedule.shift();

          if (nextInterval === undefined) {
            throw new Error('Operation timed out.');
          }

          Ember.run.later(operation, scheduleNextPoll, nextInterval);
        }, (e) => {
          if(e.status !== 404) {
            throw e;
          }
          resolve();
        }).catch((e) => {
          e.operation = operation;
          reject(e);
        });
      };

      scheduleNextPoll();
    });
  },

  isDone: Ember.computed("status", function() {
    const operationStatus = this.get("status");
    if (operationStatus === "succeeded") { return true; }
    if (operationStatus === "failed") { return true; }
    return false;
  })
});
