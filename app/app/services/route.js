import Ember from "ember";

export default Ember.Route.extend({
  titleToken: function(){
    let app = this.modelFor('app');

    return `${app.get('handle')} Services`;
  },

  model: function(){
    let app = this.modelFor('app');
    let currentUser = this.session.get('currentUser');

    return Ember.RSVP.hash({
      app: app,
      sshKeys: currentUser.get('sshKeys'),
      services: app.get('services')
    });
  },

  setupController: function(controller, model) {
    controller.set('model', model.services);
    controller.set('app', model.app);
    controller.set('sshKeys', model.sshKeys);
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
