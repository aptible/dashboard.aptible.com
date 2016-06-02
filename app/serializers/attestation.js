import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    id: { serialize: false }
  }
});