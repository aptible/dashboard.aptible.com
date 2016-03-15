import Ember from "ember";

export default Ember.Route.extend({
  model: function(){
    var app = this.modelFor('app');
    return app.get('services');
  },
});
