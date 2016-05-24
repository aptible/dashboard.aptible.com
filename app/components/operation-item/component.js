import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: [':operation-item'],
  operationAction: function() {
    var type = this.get('operation.type');
    if(type === 'execute') {
      return 'SSHed';
    }
    if(type === 'rebuild') {
      return 'rebuilt';
    }
    if (type.slice(-1) === 'e') {
      return `${type}d`;
    }
    return `${type}ed`;
  }.property('operation.type')
});
