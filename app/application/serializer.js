import HalSerializer from "ember-data-hal-9000/serializer";

export default HalSerializer.extend({

  attrs: {
    stack: {
      key: 'account'
    }
  },

  normalize: function(type, hash, property) {
    var payload = this._super(type, hash, property);

    if (payload.links.account) {
      payload.links.stack = payload.links.account;
      delete payload.links.account;
    }
    if (payload.links.accounts) {
      payload.links.stacks = payload.links.accounts;
      delete payload.links.accounts;
    }
    return payload;
  },

});
