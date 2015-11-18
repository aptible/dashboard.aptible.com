import Ember from 'ember';

export default Ember.Component.extend({
 classNames: ['team-index'],
 teamMembers: Ember.computed('users.[]', function() {
    let teamDocument = this.get('teamDocument');

    return this.get('users').map(function(user) {
      return { user: user,document: teamDocument.addItem() };
    });
  })
});
