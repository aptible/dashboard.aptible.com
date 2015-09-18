import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  normalize() {
    var payload = this._super(...arguments);

    if (!(payload && payload.links && payload.links.stack)) {
      return payload;
    }

    var stackHrefParts = payload.links.stack.split('/');
    var stackId = stackHrefParts[stackHrefParts.length - 1];

    payload.stack = stackId;

    return payload;
  },

  attrs: {
    status: {serialize: false},
    account: {serialize: false},
    stack: {serialize: false},
    gitRepo: {serialize: false}
  }
});
