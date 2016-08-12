import Ember from "ember";

export default Ember.Route.extend({
  model() {
    var app = this.modelFor('app');
    return app.get('vhosts');
  }
});
