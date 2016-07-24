import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['aptable__member-row'],
  tagName: 'tr',

  hasOwnerShield: Ember.computed('user.roles.[]', function() {
    return this.get('user').isOwner(this.get('user.roles'), this.get('organization'));
  })
});
