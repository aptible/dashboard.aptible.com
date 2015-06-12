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
        let hostWithCredentials = connectionUrl.substring(0, connectionUrl.lastIndexOf(hostWithoutPort)) + hostWithoutPort;

        let model = this.get('model');
        model.set('drainHost', hostWithCredentials);
        model.set('drainPort', a.port);
      }},
      isSyslogDrain: Ember.computed("model.drainType", function() {
        return this.get("model.drainType") === "syslog_tls_tcp";
      })
    });
