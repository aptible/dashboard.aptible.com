import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    return this.session.get('currentUser');
  },

  resetController(controller){
    controller.setProperties({
      changingEmail: false,
      changingPassword: false,

      passwordError: null,
      emailError: null
    });
  },

  actions: {
    changePassword(){
      var controller = this.controller;

      // Changing password is a 2-step process. We show the
      // "enter current password" input after clicking the button once
      if (!controller.get('changingPassword')) {
        controller.set('changingPassword', true);
        return;
      }

      controller.set('passwordError', null);

      var user = this.currentModel;

      user.save().then(function(){
        controller.set('changingPassword', false);
        user.set('passwordConfirmation', null);
        user.set('currentPassword', null);

        // TODO this will leave the user in a dirty state.
        user.set('password', null);
      }).catch(function(e){
        var message = e.responseJSON ? e.responseJSON.message : e.message;
        if (!message) { message = 'Unknown error'; }
        controller.set('passwordError',message);
      });
    },

    changeEmail(){
      // Changing email is a 2-step process. We show the
      // "enter current password" input after clicking the button once
      if (!this.controller.get('changingEmail')) {
        this.controller.set('changingEmail', true);
        return;
      }

      this.controller.set('emailError', null);

      let user = this.currentModel;

      user.save().catch( (e) => {
        var message = e.responseJSON ? e.responseJSON.message : e.message;
        if (!message) { message = 'Unknown error'; }
        this.controller.set('emailError',message);
      }).finally( () => {

        // Clears the current password input
        user.set('currentPassword', null);

        this.controller.set('changingEmail', false);
      });
    }
  }
});
