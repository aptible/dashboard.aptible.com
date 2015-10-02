import HalSerializer from "ember-data-hal-9000/serializer";
import Ember from 'ember';

export const MODEL_NAME_MAP = {
  account: 'stack',
  criterium: 'criterion'
};

export function modelNameFromPayloadKey(key) {
  return Ember.get(MODEL_NAME_MAP, key) || key;
}

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

  modelNameFromPayloadKey(key){
    var result = this._super(key);
    return modelNameFromPayloadKey(result);
  },

  extractArray: function(store, primaryType, rawPayload) {
    if (rawPayload._embedded && rawPayload._embedded.accounts) {
      rawPayload._embedded.stacks = rawPayload._embedded.accounts;
      delete rawPayload._embedded.accounts;
    }
    return this._super(store, primaryType, rawPayload);
  },

  normalize: function(type, hash, property) {
    var payload = this._super(...arguments);

    if(payload.links) {
      payload = this._convertStacks(payload);
      payload = this._transposeLinks(payload, type);
    }

    return payload;
  },

  // Add a reference to the original pre-normalized payload to the payload
  // itself.  The pre-normalized payload can then be used when attempting to
  // fetch from cache
  extractSingle: function(store, primaryType, rawPayload, recordId) {
    let payload = rawPayload;
    payload.rawPayload = Ember.$.extend(true, {}, payload);
    return this._super(store, primaryType, payload, recordId);
  },

  _convertStacks(payload) {
    if(payload.links.account) {
      payload.links.stack = payload.links.account;
      delete payload.links.account;
    }

    if(payload.links.accounts) {
      payload.links.stacks = payload.links.accounts;
      delete payload.links.accounts;
    }

    return payload;
  },

  _transposeLinks(payload, type) {
    // TODO: Upgrading ED and HAL9000 should remove the need for this function.
    // The below fixes issues with ED resolving relationships correctly by
    // manually setting relationships from _links onto the payload body.
    type.eachRelationship((modelName, modelClass) => {
      if(modelClass.kind !== 'belongsTo') {
        return;
      }

      let relationHref = payload.links[modelName];
      if(relationHref && !payload[modelName]) {
        payload[modelName] = this._idFromHref(relationHref);
      }

    });

    return payload;
  },

  _idFromHref(href) {
    let parts = href.split('/');
    return parts[parts.length - 1];
  }
});
