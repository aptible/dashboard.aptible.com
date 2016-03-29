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

  setupController: function(controller, model) {
    let app = this.modelFor('app');

    controller.set('model', model);
    controller.set('app', app);
  },

  actions: {
    scaleService: function(service, containerCount, deferred){
      let op = this.store.createRecord('operation', {
        type: 'scale',
        containerCount: containerCount,
        service: service
      });
      op.save().then(deferred.resolve, deferred.reject);
    }
  }
});
