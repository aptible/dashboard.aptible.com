import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    var app = this.modelFor('app');

    return Ember.RSVP.hash({
      vhost: this.store.createRecord('vhost'),
      services: app.get('services')
    });
  },

  setupController: function(controller, model){
    var vhost = model.vhost,
        services = model.services;

    controller.set('model', vhost);
    controller.set('services', services);
    controller.set('vhostService', services.objectAt(0));
  },

  actions: {
    willTransition: function(){
      this.currentModel.rollback();
    },

    save: function(vhost, service){
      var route = this;
      vhost.set('service', service);

      vhost.save().then(function(){
        route.transitionTo('app.vhosts');
      });
    },

    cancel: function(){
      this.transitionTo('app.vhosts');
    }
  }
});
