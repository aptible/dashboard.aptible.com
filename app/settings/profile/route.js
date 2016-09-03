import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    return this.session.get('currentUser');
  },

  setupController(controller, model){
    controller.set('model', model);
    controller.set('userName', model.get('name'));
  },

  actions: {
    submit(newName){
      let user = this.currentModel;

      user.set('name', newName);
      user.save().then(() => {
        let message = `Profile updated`;
        Ember.get(this, 'flashMessages').success(message);
      });
    }
  }
});
