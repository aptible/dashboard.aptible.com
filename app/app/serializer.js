import ApplicationSerializer from '../application/serializer';

export default ApplicationSerializer.extend({

  attrs: {
    status: {serialize: false},
    account: {serialize: false},
    stack: {serialize: false},
    gitRepo: {serialize: false}
  }

});
