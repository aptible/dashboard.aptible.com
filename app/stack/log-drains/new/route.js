import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Route.extend({
  model: function(){
    return this.store.createRecord('log-drain');
  },

  actions: {
    cancel: function(log){
      log.deleteRecord();
      this.transitionTo('stack.log-drains.index');
    },

    createLog: function(log){
      let route = this;

      log.set('stack', this.modelFor('stack'));

      log.save().then(function(){
        route.transitionTo('stack.log-drains.index');
      }).catch(function(e){
        if (!(e instanceof DS.InvalidError)) {
          return e;
        }
      });
    }
  }
});
