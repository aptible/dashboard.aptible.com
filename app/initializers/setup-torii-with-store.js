export function initialize(container, application) {
   application.inject('torii-adapter', 'store', 'store:main');
}

export default {
  name: 'setup-torii-with-store',
  initialize: initialize
};
