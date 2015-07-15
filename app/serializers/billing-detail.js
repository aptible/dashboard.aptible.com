import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  extract: function(store, type, payload, id, requestType) {
    this.__requestType = requestType; // used by `extractMeta`
    return this.normalize(type, payload);
  }
});