export function initialize(container, application) {
   application.inject('component', 'store', 'store:main');
}

export default {
  name: 'setup-component-with-store',
  initialize: initialize
};
