import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Route.extend({
  model: function(){
    return this.store.createRecord('log-drain');
  },

  renderTemplate: function(controller){
    if (!this.session.get('currentUser.verified')) {
      controller.set('resourceType', 'log drain');
      this.render('shared/unverified');
    } else {
      this._super.apply(this, arguments);
    }
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
        if (e instanceof DS.InvalidError) {
          // no-op, this will populate model.errors
        } else {
          throw e; // re-raise
        }
      });
    }
  }
});
