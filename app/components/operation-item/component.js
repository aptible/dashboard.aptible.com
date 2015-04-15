import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: [':operation-item'],
  operationAction: function() {
    var type = this.get('operation.type');
    if(type === 'execute') {
      return 'SSHed';
    } else if (type === 'configure') {
      return 'configured';
    } else {
      return `${type}ed`;
    }
  }.property('operation.type')
});
