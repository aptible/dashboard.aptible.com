import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    var db = this.modelFor('databases.show');

    return db.get('operations');
  },

  setupController: function(controller, model){
    controller.set('db', this.modelFor('databases.show'));
    controller.set('operations', model);
  }
});
