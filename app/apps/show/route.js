import Ember from 'ember';

export default Ember.Route.extend({
  requireAuthentication: true,

  setupController: function(controller, model){
    this._super(controller, model);
    controller.set('app', model);
  }
});
