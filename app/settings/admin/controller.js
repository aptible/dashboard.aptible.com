import Ember from 'ember';

var and = Ember.computed.and;

export default Ember.Controller.extend({
  isSavingPassword: and('changingPassword',
                        'session.currentUser.isSaving'),
  isSavingEmail: and('changingEmail',
                     'session.currentUser.isSaving')
});
