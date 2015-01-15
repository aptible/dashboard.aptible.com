import Ember from "ember";

export default Ember.Route.extend({

  model: function(){
    var app = this.modelFor('app');
    return app.get('services');
  },

  actions: {
    scaleService: function(service, containerCount, deferred){
      service.set('containerCount', containerCount);
      service.save().then(function(r){
        deferred.resolve(r);
      }, function(e){
        deferred.reject(e);
      });
    }
  }

});
