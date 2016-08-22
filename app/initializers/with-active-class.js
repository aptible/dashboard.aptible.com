export function initialize(container, application) {
  application.inject('component:with-active-class', 'applicationController', 'controller:application');
}

export default {
  name: 'with-active-class',
  initialize: initialize
};
