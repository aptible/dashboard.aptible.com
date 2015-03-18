import Ember from 'ember';

export default Ember.Component.extend({
  attributeBindings: ['title'],
  classNames: ['git-ref'],
  shortenedRef: function() {
    return this.get('gitRef').substring(0,10);
  }.property('gitRef')
});
