import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller, model){
    this._super(controller, model);

    var service = model;
    controller.set('service', model);

    var vhost = this.store.createRecord('vhost', {
      service: service
    });
    controller.set('vhost', vhost);
  },

  actions: {
    save: function(){
      var vhost = this.controller.get('vhost');
      var route = this;

      // TODO ensure something onscreen shows vhost.errors
      vhost.save().then(function(){
        route.transitionTo('apps');
      });
    }
  }
});
