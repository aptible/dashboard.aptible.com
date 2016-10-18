export function initialize(container, application) {
  application.inject('controller', 'complianceStatus', 'service:complianceStatus');
  application.inject('component', 'complianceStatus', 'service:complianceStatus');
  application.inject('route', 'complianceStatus', 'service:complianceStatus');
}

export default {
  name: 'compliance-status-service',
  initialize: initialize
};
