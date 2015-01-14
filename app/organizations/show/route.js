import Ember from 'ember';

export default Ember.Route.extend({

  setupController: function(controller, model) {
    var organizations = this.modelFor('organizations');
    controller.set('model', model);
    controller.set('organizations', organizations);
  }

});
