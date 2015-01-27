import HalSerializer from "ember-data-hal-9000/serializer";

export default HalSerializer.extend({
  /*
   * Overridden to remove top-level namespaces.
   * The adapter would ordinarily return a hash like:
   * `{user: {id: 1, ...}}` when serializing a user.
   * Our API expects no top-level namespace so this is transformed into
   * `{id: 1, ...}`
   */
  serializeIntoHash: function(hash, type, record, options){
    var serialized = this.serialize(record, options);

    for (var key in serialized) {
      hash[key] = serialized[key];
    }
  },

  typeForRoot: function(typeKey){
    var result = this._super(typeKey);
    if (result === 'account') {
      result = 'stack';
    }

    return result;
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
