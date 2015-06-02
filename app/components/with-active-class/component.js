import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['isActive:active'],

  isActive: Ember.computed('route', 'applicationController.currentPath', function() {
    var currentPath = this.applicationController.get('currentPath');
    var route = this.get('route');
    return currentPath.indexOf(route) > -1;
  })
});
