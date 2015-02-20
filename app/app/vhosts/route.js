import Ember from "ember";

export default Ember.Route.extend({
  model: function(){
    var app = this.modelFor('app');

    return app.get('vhosts');
  },
  redirect: function() {
    var app = this.modelFor('app');
    if(app.get('vhosts.length') === 0) {
      this.replaceWith('app.vhosts.new', app);
    }
  }
});
