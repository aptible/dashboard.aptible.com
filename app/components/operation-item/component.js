import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: [':operation-item'],
  operationAction: function() {
    var type = this.get('operation.type');
    if(type === 'execute') {
      type = 'SSH';
    }

    return `${type}ed`;
  }.property('operation.type')
});
