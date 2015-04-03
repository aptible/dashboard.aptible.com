import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'ul',
  classNames: 'user-gravatars',
  truncatedUsers: function() {
    let count = this.get('count') || this.get('users.length');
    return this.get('users').slice(0, count);
  }.property('users.[]', 'count')
});
