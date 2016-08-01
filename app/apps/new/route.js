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
      let app = this.currentModel;
      let route = this;
      this.controller.set('isSaving', true);

      app.save({ stack: {id: app.get('stack.id')} }).then(() => {
        route.transitionTo('app', app);
        let message = `${app.get('handle')} app created`;
        Ember.get(this, 'flashMessages').success(message);
        Ember.run.later(() => {
          this.controller.set('isSaving', false);
        });
      }, () => {
        this.controller.set('isSaving', false);
      });
    },

    cancel(){
      this.transitionTo('apps.index');
    }
  }
});
