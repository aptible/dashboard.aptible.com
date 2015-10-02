import HalAdapter from "ember-data-hal-9000/adapter";
import DS from "ember-data";
import Ember from "ember";
import config from "../config/environment";
import { modelNameFromPayloadKey } from '../serializers/application';

let accessToken;

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export default HalAdapter.extend({
  host: config.apiBaseUri,

  headers: Ember.computed(function(){
    if (!getAccessToken()) {
      return {};
    }
    return {
      'Authorization': 'Bearer ' + getAccessToken()
    };
  }).volatile(),

  pathForType: function(type){
    if (type === 'stack') {
      type = 'account';
    }

    if(type === 'criterion') {
      return 'criteria';
    }

    return this._super(type);
  },

  ajaxError: function(jqXHR){
    var error = this._super(jqXHR);
    if (jqXHR && jqXHR.status === 422) {
      var payload = Ember.$.parseJSON(jqXHR.responseText);
      return new DS.InvalidError({
        message: payload.message
      });
    } else {
      return error;
    }
  },

  // Our current  version of ED defaults to loading belongsTo relationships
  // directly from the server.  This patch changes that behavior to first
  // see if the record is already loaded in store.  If so, that record is
  // resolved immediately and a request is never made.
  findBelongsTo(store, link, relationshipPath) {
    // relationshipPath: users/id
    let segments = relationshipPath.split('/');
    let id = segments[segments.length - 1];
    let modelName = Ember.String.singularize(segments[segments.length - 2]);
    let payload;

    modelName = modelNameFromPayloadKey(modelName);
    payload = this._payloadFromCache(modelName, id, store);

    if(payload) {
      return Ember.RSVP.resolve(payload);
    } else {
      return this._super(...arguments);
    }
  },

  // Given a modelName, id, and store, check if model exists in store and
  // return its pre-normalized payload
  _payloadFromCache(modelName, id, store) {
    let record, payload;

    if(modelName && id && store.hasRecordForId(modelName, id)) {
      record = store.recordForId(modelName, id);
      payload = record.get('_data.rawPayload');
    }

    return payload;
  }
});
