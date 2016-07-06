import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: 'delimited-list',

  count: null,
  list: null,
  listKey: null,

  hasValues: Ember.computed.gt('list.length', 0),

  values: Ember.computed('list.[]', function() {
    var count = this.getWithDefault('count', this.get('list.length'));
    var key = this.get('listKey');

    var result = this.get('list.content').mapBy(key).slice(0, count).join(', ');
    if (this.get('difference') !== 0) {
      result += ', ';
    }
    return result;
  }),

  difference: Ember.computed('list.[]', function() {
    return Math.max(this.get('list.length') - this.get('count'), 0);
  })
});
