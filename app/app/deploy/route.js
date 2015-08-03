import Ember from "ember";

export default Ember.Route.extend({
  redirect() {
    let app = this.modelFor('app') ;

    if(app.get('services.length') > 0) {
      this.transitionTo('app.index');
    }
  },

  model: function(){
    let app = this.modelFor('app');
    let currentUser = this.session.get('currentUser');

    return Ember.RSVP.hash({
      app: app,
      sshKeys: currentUser.get('sshKeys')
    });
  },

  setupController: function(controller, model){
    controller.set('model', model.app);
    controller.set('sshKeys', model.sshKeys);
  },

  actions: {
    delete: function(model){
      let stack = model.get('stack');
      model.deleteRecord();
      model.save().then(() => {
        let message = `${model.get('handle')} destroyed`;

        this.transitionTo('apps', stack);
        Ember.get(this, 'flashMessages').success(message);
      });
    }
  }
});
