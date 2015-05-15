export function initialize(container, application) {
  application.inject('component', 'analytics', 'service:analytics');
  application.inject('route', 'analytics', 'service:analytics');
}

export default {
  name: 'analytics-service',
  initialize: initialize
};
