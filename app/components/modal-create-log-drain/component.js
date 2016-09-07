import Ember from 'ember';

// We create an anchor since that is, afaik, the easiest way to parse a url in javascript
function parseUrl(url) {
  let a = document.createElement('a');
  a.href = url;
  a.hostWithoutPort = a.host.substring(0, a.host.lastIndexOf(':')); // Remove port

  // Workaround for HTMLAnchorElement not properly parsing username and password in phantomjs.
  if(!a.username && !a.password) {
    let credentials = url.substring(a.protocol.length + 2, url.lastIndexOf('@' + a.hostWithoutPort)).split(':');
    a.username = credentials[0];
    a.password = credentials[1];
  }

  return a;
}

export default Ember.Component.extend({
  newLogDrain: null,
  title: Ember.computed('stack.handle', function() {
    return `Create a new log drain on ${this.get('stack.handle')}`;
  }),

  description: Ember.computed('stack.handle', function() {
      return `Log Drains let you collect stdout and stderr logs from your apps
              deployed on ${this.get('stack.handle')} and route them to a log
              destination.`;
  }),
  isPending: Ember.computed.or('newLogDrain.isSaving', 'newLogDrain.isValidating'),
  hasError: Ember.computed.gt('errors.newLogDrain.handle.length', 0),
  isSyslogDrain: Ember.computed.equal('newLogDrain.drainType', 'syslog_tls_tcp'),
  isHttpsDrain: Ember.computed.equal('newLogDrain.drainType', 'https'),
  isHostPortDrain: Ember.computed.or('isSyslogDrain', 'isHttpsDrain'),

  disableSave: Ember.computed('isHostPortDrain', 'esDatabases', function() {
    return this.get('newLogDrain.isSaving') ||
           (!this.get('isHostPortDrain') &&
           this.get('esDatabases.length') === 0);
  }),

  setDrainFromDatabase: Ember.observer('esDatabase', function() {
    let database = this.get('esDatabase');

    if(database) {
      let connectionUrl = database.get('connectionUrl');
      let a = parseUrl(connectionUrl);

      let newLogDrain = this.get('newLogDrain');
      newLogDrain.set('drainHost', a.hostWithoutPort);
      newLogDrain.set('drainPort', a.port);
      newLogDrain.set('drainUsername', a.username);
      newLogDrain.set('drainPassword', a.password);
    }
  }),

  dismissOnSave: Ember.observer('newLogDrain.isNew', function() {
    if(this.get('newLogDrain.isNew') === false) {
      if (!this.isDestroyed) {
        this.sendAction('dismiss');
      }
    }
  }),

  focusHandle: Ember.on('didInsertElement', function() {
    Ember.run.later(() => {
      this.$('input').eq(0).focus();
    });
  }),

  actions: {
    httpsSelected () {
      let newLogDrain = this.get('newLogDrain');
      if (!newLogDrain.get('drainPort')) {
        newLogDrain.set('drainPort', '443');
      }
    },

    onDismiss() {
      this.get('newLogDrain').rollback();
      //this.sendAction('dismiss');
    },

    createLogDrain() {
      let logDrain = this.get('newLogDrain');
      this.sendAction('onCreateLogDrain', logDrain);
    },

    outsideClick: Ember.K
  }
});
