import Ember from 'ember';

export default Ember.Route.extend({
  title: function(){
    var stack = this.modelFor('stack');
    return `Create an App - ${stack.get('handle')}`;
  },

  model: function(){
    var stack = this.modelFor('stack');
    return this.store.createRecord('app', {
      stack: stack
    });
  },

  renderTemplate: function(controller){
    if (!this.session.get('currentUser.verified')) {
      controller.set('resourceType', 'app');
      this.render('shared/unverified');
    } else {
      this._super.apply(this, arguments);
    }
  },

  actions: {
    willTransition: function(){
      this.currentModel.rollback();
    },

    create: function(){
      var app = this.currentModel;
      var route = this;
      app.save({ stack: {id: app.get('stack.id')} }).then(function(){
        route.transitionTo('apps.index');
      });
    },

    cancel: function(){
      this.transitionTo('apps.index');
    }
  }
});
