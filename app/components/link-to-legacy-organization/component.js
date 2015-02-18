import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  path: function(){
    return `organizations/${this.get('organization.id')}`;
  }.property('organization.id')
});
