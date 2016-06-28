import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: 'delimited-list',

  count: null,
  list: null,
  listKey: null,

  values: Ember.computed('count', function() {
    var count = this.get('count') || this.get('list').length;
    var key = this.get('listKey');
    
    return this.get('list').mapBy(key).slice(0, count).join(', ');
  }),

  difference: Ember.computed('count', function() {
    return Math.max(this.get('list').length - this.get('count'), 0);
  })
});
