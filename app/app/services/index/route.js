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
    scaleService: function(service, containerCount, containerSize, deferred) {
      this.store.createRecord('operation', {
        type: 'scale',
        containerSize: containerSize,
        containerCount: containerCount,
        service: service
      }).save()
        .then((operation) => operation.reloadUntilStatusChanged(1000 * 60 * 15 /* minutes */))
        .then(() => service.reload())
        .then(deferred.resolve, deferred.reject);
    }
  }
});
