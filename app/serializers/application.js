import HalSerializer from "ember-data-hal-9000/serializer";

export default HalSerializer.extend({

  attrs: {
    stack: {
      key: 'account'
    }
  },

  extractArray: function(store, primaryType, rawPayload) {
    if (rawPayload._embedded && rawPayload._embedded.accounts) {
      rawPayload._embedded.stacks = rawPayload._embedded.accounts;
      delete rawPayload._embedded.accounts;
    }
    return this._super(store, primaryType, rawPayload);
  },

  normalize: function(type, hash, property) {
    var payload = this._super(type, hash, property);

    if(payload["default"]) {
      payload["isDefault"] = payload["default"];
    }

    if (payload.links && payload.links.account) {
      payload.links.stack = payload.links.account;
      delete payload.links.account;
    }
    if (payload.links && payload.links.accounts) {
      payload.links.stacks = payload.links.accounts;
      delete payload.links.accounts;
    }
    return payload;
  },

});
