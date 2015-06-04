import Ember from "ember";

export default Ember.Controller.extend({
    actions: {
    setDrainFromDatabase(database) {
        let connectionUrl = database.get('connectionUrl');
        let [host, port] = connectionUrl.split(':');
        let model = this.get('model');
        model.set('drainHost', host);
        model.set('drainPort', port);
    }},
    isSyslogDrain: Ember.computed("model.drainType", function() {
        return this.get("model.drainType") === "syslog_tls_tcp";
    })
});