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
      let reloadUntilOperationStatusChanged = (operation, maximumTimeout, timeout) => {
        return operation.reload().then((o) => {
          return new Ember.RSVP.Promise((resolve, reject) => {
            if(timeout > maximumTimeout) {
              return reject(new Error('Operation timed out.'));
            }

            let status = o.get('status');
            if(status === 'succeeded') {
              return resolve(o);
            } else if(status === 'failed') {
              return reject(new Error('Operation failed.'));
            }

            Ember.run.later(o, () => {
              return resolve(reloadUntilOperationStatusChanged(o, maximumTimeout, timeout * 2));
            }, timeout);
          });
        });
      };

      this.store.createRecord('operation', {
        type: 'scale',
        containerSize: containerSize,
        containerCount: containerCount,
        service: service
      }).save()
        .then((operation) => reloadUntilOperationStatusChanged(operation, 1000 * 60 * 15 /* minutes */, 1000))
        .then(() => service.reload())
        .then(deferred.resolve, deferred.reject);
    }
  }
});
