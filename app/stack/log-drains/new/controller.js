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
        let a = parseUrl(database.get('connectionUrl'));

        let host = `${a.protocol}\/\/${a.username}:${a.password}@${a.host}`;
        // This assumes that the port is always set on the connection url, otherwise this'll break badly.
        let hostWithoutPort = host.substring(0, host.lastIndexOf(':'));

        let model = this.get('model');
        model.set('drainHost', hostWithoutPort);
        model.set('drainPort', a.port);
    }},
    isSyslogDrain: Ember.computed("model.drainType", function() {
        return this.get("model.drainType") === "syslog_tls_tcp";
    })
});
