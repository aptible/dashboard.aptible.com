import Ember from "ember";

export default Ember.Route.extend({
  titleToken: function(){
    let app = this.modelFor('app');

    return `${app.get('handle')} Services`;
  },

  model: function(){
    var app = this.modelFor('app');
    return app.get('services');
  },

  actions: {
    scaleService: function(service, containerCount, deferred){
      service.set('containerCount', containerCount);
      service.save().then( () => {
        let op = this.store.createRecord('operation', {
          type: 'scale',
          containerCount: containerCount,
          service: service
        });
        return op.save();
      }).then(deferred.resolve, deferred.reject);
    }
  }

});
