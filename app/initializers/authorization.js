export function initialize(container, application) {
  application.inject('controller', 'authorization', 'service:authorization');
  application.inject('component', 'authorization', 'service:authorization');
  application.inject('route', 'authorization', 'service:authorization');
}

export default {
  name: 'authorization-service',
  initialize: initialize
};
