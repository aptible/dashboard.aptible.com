export function initialize(container, application) {
  application.inject('service:current-organization', 'organizationRoute', 'route:organization');
}

export default {
  name: 'current-organization',
  initialize: initialize
};
