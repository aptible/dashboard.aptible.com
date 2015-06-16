import Ember from "ember";

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

export default Ember.Controller.extend({
  actions: {
    setDrainFromDatabase(database) {
      let connectionUrl = database.get('connectionUrl');
      let a = parseUrl(connectionUrl);

      let model = this.get('model');
      model.set('drainHost', a.hostWithoutPort);
      model.set('drainPort', a.port);
      model.set('drainUsername', a.username);
      model.set('drainPassword', a.password);
    }},
    isSyslogDrain: Ember.computed("model.drainType", function() {
      return this.get("model.drainType") === "syslog_tls_tcp";
    })
  });
