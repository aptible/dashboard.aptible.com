export function initialize(container, application) {
  application.inject('route', 'flashMessages', 'service:flash-messages');
  application.inject('controller', 'flashMessages', 'service:flash-messages');
}

export default {
  name: 'flash-messages-service',
  initialize: initialize
};
