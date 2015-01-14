import Ember from "ember";

export default Ember.Route.extend({
  model: function(){
    var app = this.modelFor('app');
    var vhosts = [];

    // TODO should be an easier way to get app.vhosts
    // API should respond to /apps/:id/vhosts with a scope array of vhosts
    return app.get('services').then(function(services){
      var vhostPromises = services.map(function(service){
        return service.get('vhosts');
      });

      return Ember.RSVP.all(vhostPromises).then(function(vhostsArray){
        vhostsArray.forEach(function(vhostArray){
          vhosts.pushObjects(vhostArray.get('content'));
        });
      });
    }).then(function(){
      return vhosts;
    });
  }
});
