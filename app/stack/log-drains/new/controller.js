import Ember from "ember";

// We create an anchor since that is, afaik, the easiest way to parse a url in javascript
function parseUrl(url) {
  let a = document.createElement('a');
  a.href = url;
  return a;
}

export default Ember.Controller.extend({
  actions: {
    setDrainFromDatabase(database) {
      let connectionUrl = database.get('connectionUrl');
      let a = parseUrl(connectionUrl);

      let hostWithoutPort = a.host.substring(0, a.host.lastIndexOf(':')); // Remove port
      let credentials = connectionUrl.substring(a.protocol.length + 2, connectionUrl.lastIndexOf('@' + hostWithoutPort)).split(':');
      let userName = credentials[0];
      let password = credentials[1];

      let model = this.get('model');
      model.set('drainHost', hostWithoutPort);
      model.set('drainPort', a.port);
      model.set('drainUsername', userName);
      model.set('drainPassword', password);
    }},
    isSyslogDrain: Ember.computed("model.drainType", function() {
      return this.get("model.drainType") === "syslog_tls_tcp";
    })
  });
