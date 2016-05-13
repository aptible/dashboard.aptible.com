import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'ul',
  classNames: 'user-gravatars',
  truncatedUsers: Ember.computed('users.[]', 'count', function() {
    let count = this.get('count') || this.get('users.length');
    return Ember.A(this.get('users').slice(0, count));
  }),
  difference: Ember.computed('users.[]', 'count', function() {
    return Math.max(this.get('users.length') - this.get('count'), 0);
  })
});
