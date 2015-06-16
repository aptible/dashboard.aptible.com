import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Route.extend({

  model: function(){
    var stack = this.modelFor('stack');
    return Ember.RSVP.hash({
      logDrain: this.store.createRecord('log-drain', {drainType: 'syslog_tls_tcp' }),
      elasticsearchDbs: stack.get('databases').then((databases) => {
        return databases.filter((database) => {
          return database.get('type') === 'elasticsearch' && !!database.get('connectionUrl');
      });
    })
  });
  },

  setupController(controller, model) {
    controller.set('model', model.logDrain);
    controller.set('esDatabases', model.elasticsearchDbs);
  },


renderTemplate: function(controller){
    if (!this.session.get('currentUser.verified')) {
      controller.set('resourceType', 'log drain');
      this.render('unverified');
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
      log.set('stack', this.modelFor('stack'));

      log.save().then( () => {
        let op = this.store.createRecord('operation', {
          type: 'configure',
          logDrain: log
        });
        return op.save();
      }).then( () => {
        this.transitionTo('stack.log-drains.index');
      }).catch( (e) => {
        if (e instanceof DS.InvalidError) {
          // no-op, this will populate model.errors
        } else {
          throw e; // re-raise
        }
      });
    }
  }
});
