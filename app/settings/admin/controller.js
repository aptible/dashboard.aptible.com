import Ember from 'ember';

var and = Ember.computed.and;

export default Ember.Controller.extend({
  changingPassword: false,
  changingEmail: false,
  passwordError: null,
  emailError: null,

  isSavingPassword: and('changingPassword',
                        'session.currentUser.isSaving'),
  isSavingEmail: and('changingEmail',
                     'session.currentUser.isSaving')
});
