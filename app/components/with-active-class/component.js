import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['isActive:active'],

  isActive: function(){
    var currentPath = this.applicationController.get('currentPath');
    var route = this.get('route');
    return currentPath.indexOf(route) === 0;
  }.property('route', 'applicationController.currentPath')

});
