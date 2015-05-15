import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({

  attrs: {
    status: {serialize: false},
    account: {serialize: false},
    stack: {serialize: false},
    gitRepo: {serialize: false}
  }

});
