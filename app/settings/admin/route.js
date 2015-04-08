import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    return this.session.get('currentUser');
  },

  resetController(controller){
    controller.setProperties({
      changingEmail: false,
      changingPassword: false
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

      var user = this.currentModel;

      user.save().then(() => {
        controller.set('changingPassword', false);
        user.set('passwordConfirmation', null);
        user.set('currentPassword', null);

        // TODO this will leave the user in a dirty state.
        user.set('password', null);

        Ember.get(this, 'flashMessages').success('Password updated');
      }).catch((e) => {
        let message = e.responseJSON ? e.responseJSON.message : e.message;
        message = message || 'There was an unexpected error updating email';

        Ember.get(this, 'flashMessages').danger(message);
      });
    },

    changeEmail(){
      // Changing email is a 2-step process. We show the
      // "enter current password" input after clicking the button once
      if (!this.controller.get('changingEmail')) {
        this.controller.set('changingEmail', true);
        return;
      }

      let user = this.currentModel;

      user.save().then(() => {
        let message = `Email updated to ${user.get('email')}`;
        Ember.get(this, 'flashMessages').success(message);
      }).catch( (e) => {
        let message = e.responseJSON ? e.responseJSON.message : e.message;
        message = message || 'There was an unexpected error updating email';

        Ember.get(this, 'flashMessages').danger(message);
      }).finally( () => {

        // Clears the current password input
        user.set('currentPassword', null);

        this.controller.set('changingEmail', false);
      });
    }
  }
});
