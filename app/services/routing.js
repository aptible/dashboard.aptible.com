import Ember from 'ember';

export default Ember.Service.extend({
  currentPath: Ember.computed.reads('applicationController.currentPath'),

  applicationController: null,

  init(){
    this.applicationController =
      this.container.lookup('controller:application');
  }
});
