import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    var app = this.modelFor('apps.show');

    return app.get('domains');
  },

  setupController: function(controller, model){
    this._super(controller, model);

    controller.set('app', this.modelFor('apps.show'));
    controller.set('domains', model);
  }
});
