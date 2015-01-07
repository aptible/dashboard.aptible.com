import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller, model){
    controller.set('model', model);
    controller.set('sectionTitle', 'Databases');
    controller.set('sectionPath', 'databases.index');
  }
});
