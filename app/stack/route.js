import Ember from 'ember';

export default Ember.Route.extend({
  requireAuthentication: true,

  setupController: function(controller, model){
    controller.set('model', model);

    // for nav dropdown
    controller.set('sectionTitle', 'Databases');
    controller.set('sectionPath', 'databases.index');
  }

});
