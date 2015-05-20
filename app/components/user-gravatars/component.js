import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'ul',
  classNames: 'user-gravatars',
  truncatedUsers: Ember.computed('users.[]', 'count', function() {
    let count = this.get('count') || this.get('users.length');
    return Ember.A(this.get('users').slice(0, count));
  })
});
