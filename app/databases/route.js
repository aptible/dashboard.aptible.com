import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function(){
    var route = this;
    if (!this.session.get('isAuthenticated')) {
      return this.session.fetch('aptible').catch(function(){
        route.transitionTo('login');
      });
    }
  },
  setupController: function(controller, model){
    controller.set('model', model);
    controller.set('sectionTitle', 'Databases');
    controller.set('sectionPath', 'databases.index');
  }
});
