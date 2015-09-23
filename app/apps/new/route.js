import Ember from 'ember';

export default Ember.Route.extend({
  title(){
    var stack = this.modelFor('stack');
    return `Create an App - ${stack.get('handle')}`;
  },

  model(){
    var stack = this.modelFor('stack');
    return this.store.createRecord('app', {
      stack: stack
    });
  },

  renderTemplate(controller){
    if (!this.session.get('currentUser.verified')) {
      controller.set('resourceType', 'app');
      this.render('unverified');
    } else {
      this._super.apply(this, arguments);
    }
  },

  actions: {
    willTransition(){
      this.currentModel.rollback();
    },

    create(){
      this.controller.set('savingApp', true);

      let app = this.currentModel;
      let route = this;

      app.save({ stack: {id: app.get('stack.id')} }).then(() => {
        let message = `${app.get('handle')} app created`;
        route.transitionTo('app', app);
        Ember.get(this, 'flashMessages').success(message);
        this.controller.set('savingApp', false);
      }, () => {
        this.controller.set('savingApp', false);
      });
    },

    cancel(){
      this.transitionTo('apps.index');
    }
  }
});
