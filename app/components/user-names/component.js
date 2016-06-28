import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'ul',
  classNames: 'user-names',

  names: Ember.computed('users.[]', 'count', function() {
    var count = this.get('count') || this.get('users.length');
    return this.get('users').mapBy('name').slice(0, count).join(', ');
  }),

  difference: Ember.computed('users.[]', 'count', function() {
    return Math.max(this.get('users.length') - this.get('count'), 0);
  })
});
